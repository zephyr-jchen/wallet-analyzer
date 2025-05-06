const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = 3001;

app.use(cors());

app.get('/api/address/:addr', async (req, res) => {
    const address = req.params.addr;
    const apiKey = process.env.ETHERSCAN_API_KEY;
    // console.log("API KEY:", process.env.ETHERSCAN_API_KEY);

    try {
        const balanceResp = await axios.get(`https://api.etherscan.io/api`, {
            params: {
                module: 'account',
                action: 'balance',
                address: address,
                tag: 'latest',
                apikey: apiKey
            }
        });

        const txCountResp = await axios.get(`https://api.etherscan.io/api`, {
            params: {
                module: 'proxy',
                action: 'eth_getTransactionCount',
                address: address,
                tag: 'latest',
                apikey: apiKey
            }
        });

        res.json({
            address: address,
            balance_wei: balanceResp.data.result,
            tx_count: parseInt(txCountResp.data.result, 16)
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch address info.' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
