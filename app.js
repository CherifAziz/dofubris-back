const express = require('express');
const sqlite3 = require('sqlite3').verbose();
var unidecode = require('unidecode');

const app = express();
const port = process.env.PORT || 3000;

// Enable CORS
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Max-Age", "1800");
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token,Origin, X-Requested-With, Content, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

// app.use((req, res) => {
//     res.json({ message: "LETS GO !" }); 
// });

// Database connection
const db = new sqlite3.Database('prices.db', sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Connected to the prices database.');
});

// Function to read brisage values
// function readBrisageValues(filePath) {
//     const brisageValues = {};
//     // Assuming filePath is relative to the server.js location
//     const fs = require('fs');
//     const lines = fs.readFileSync(filePath, 'utf-8').split('\n');
//     lines.forEach(line => {
//         const [item, value] = line.split(':');
//         brisageValues[unidecode(item.trim())] = value.trim();
//     });
//     return brisageValues;
// }

// API endpoint to get items
app.get('/api/items', (req, res) => {
    const query = `SELECT * FROM prices WHERE strftime('%Y-%m-%dT%H:%M', timestamp) = (SELECT strftime('%Y-%m-%dT%H:%M', MAX(timestamp)) FROM prices)`;
    db.all(query, [], (err, rows) => {
        if (err) {
            console.error(err.message);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }
        // const brisageValues = readBrisageValues('./brisage.txt');
        const itemsWithBrisage = rows.map(row => {
            const item = {
                id: row.id,
                item: row.item,
                price: row.price,
                timestamp: row.timestamp,
                // brisage_value: brisageValues[unidecode(row.item)] || 'N/A'
            };
            return item;
        });
        res.json(itemsWithBrisage);
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
