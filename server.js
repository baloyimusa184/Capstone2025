import express from 'express'; 
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import bodyParser from 'body-parser';
import path from 'path';
import bcrypt from 'bcrypt';

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.resolve('public'))); // Serve static files from the public folder

// Database Connection
const dbPromise = open({
    filename: './data_plan.db',
    driver: sqlite3.Database,
});

// Ensure users table exists
async function createUserTable() {
    const db = await dbPromise;
    const createTableQuery = `
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            pass TEXT NOT NULL
        );
    `;
    await db.run(createTableQuery);
}

// Call the function to ensure the table exists
createUserTable();

// Routes

// Register a user
app.post('/api/register', async (req, res) => {
    const { username, pass } = req.body;

    try {
        const db = await dbPromise;

        // Check if user exists
        const existingUser = await db.get('SELECT * FROM users WHERE username = ?', [username]);
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(pass, 10);

        // Insert new user into the users table
        await db.run('INSERT INTO users (username, pass) VALUES (?, ?)', [username, hashedPassword]);

        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        console.error('Error registering user:', err);
        res.status(500).json({ error: 'Error registering the user' });
    }
});

// Login a user
app.post('/api/login', async (req, res) => {
    const { username, pass } = req.body;

    try {
        const db = await dbPromise;

        const user = await db.get('SELECT * FROM users WHERE username = ?', [username]);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const isPasswordValid = await bcrypt.compare(pass, user.pass);
        if (!isPasswordValid) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        res.json({ userId: user.id, message: 'Login successful' });
    } catch (err) {
        console.error('Error logging in user:', err);
        res.status(500).json({ error: 'Error logging in the user' });
    }
});

// Delete a user
app.delete('/api/users/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const db = await dbPromise;

        // Check if the user exists
        const user = await db.get('SELECT * FROM users WHERE id = ?', [id]);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Delete the user
        await db.run('DELETE FROM users WHERE id = ?', [id]);
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (err) {
        console.error('Error deleting user:', err);
        res.status(500).json({ error: 'Failed to delete user' });
    }
});

// Start Server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
