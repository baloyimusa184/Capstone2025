import express from 'express';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import bodyParser from 'body-parser';
import path from 'path';
import csv from 'csv-parser';
import fs from 'fs';
import bcrypt from 'bcrypt';

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(express.static(path.resolve('public')));

// Database connection
const dbPromise = open({ filename: './data_plan.db', driver: sqlite3.Database });
dbPromise.then((db) => db.run(`
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        pass TEXT NOT NULL
    );
`));

// **Register**
app.post('/api/register', async (req, res) => {
    const { username, pass } = req.body;
    try {
        const db = await dbPromise;
        const existingUser = await db.get('SELECT * FROM users WHERE username = ?', [username]);
        if (existingUser) return res.status(400).json({ error: 'User already exists' });

        const hashedPassword = await bcrypt.hash(pass, 10);
        await db.run('INSERT INTO users (username, pass) VALUES (?, ?)', [username, hashedPassword]);
        res.status(201).json({ message: 'Registration successful' });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// **Login**
app.post('/api/login', async (req, res) => {
    const { username, pass } = req.body;
    try {
        const db = await dbPromise;
        const user = await db.get('SELECT * FROM users WHERE username = ?', [username]);
        if (!user) return res.status(404).json({ error: 'User not found' });

        const isPasswordValid = await bcrypt.compare(pass, user.pass);
        if (!isPasswordValid) return res.status(400).json({ error: 'Invalid credentials' });

        res.json({ userId: user.id });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// **Delete Account**
app.delete('/api/users/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const db = await dbPromise;
        await db.run('DELETE FROM users WHERE id = ?', [id]);
        res.json({ message: 'Account deleted' });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

//AI recommender
app.post('/api/recommend', (req, res) => {
    const { meal_type } = req.body;

    console.log("Received meal_type:", meal_type); // Debug: log the received meal type

    const recommendations = [];
    const csvFilePath = path.resolve('./meal_recommendations.csv'); // Path to the CSV file

    fs.createReadStream(csvFilePath)
    .pipe(csv({
        skipEmptyLines: true, // Skip empty lines in the CSV
    }))
    .on('data', (row) => {
        // Trim BOM if present and clean up spaces
        for (const key in row) {
            if (row.hasOwnProperty(key)) {
                row[key] = row[key].replace(/^\uFEFF/, '').trim(); // Remove BOM and trim
            }
        }

        console.log("Row:", row); // Log row for inspection

        if (row['Meal Type'] && row['Food Items']) {
            if (row['Meal Type'].trim().toLowerCase() === meal_type.trim().toLowerCase()) {
                recommendations.push(row['Food Items']);
            }
        } else {
            console.warn("Skipping row due to missing 'Meal Type' or 'Food Items':", row);
        }
    })
    .on('end', () => {
        console.log("Sending recommendations:", recommendations);
        res.json({ recommendations });
    })
    .on('error', (err) => {
        console.error("Error reading CSV:", err);
        res.status(500).send("Error processing recommendations");
    });


});


// Start server
app.listen(port, () => console.log(`Server running on http://localhost:${port}`));
