const PORT = 5000;
const express = require('express');
const app = express();
const cors = require('cors');
const fetch = require('node-fetch'); // Don't forget to require node-fetch
require('dotenv').config();

app.use(express.json());
app.use(cors());

const LANGUAGE_MODEL_API_KEY = process.env.LANGUAGE_MODEL_API_KEY;
const LANGUAGE_MODEL_URL = `https://generativelanguage.googleapis.com/v1beta1/models/chat-bison-001:generateMessage?key=${LANGUAGE_MODEL_API_KEY}`;

app.post('/prompt', async (req, res) => {
    try {
        const { text } = req.body;

        if (!text) {
            throw new Error('Text is required in the request body.');
        }

        const context = "Hello! I'm MailEasy AI, your helpful mail assistant. My purpose is to assist you in composing professional, code-related, or informal emails. Please provide details about the type of email you'd like, and I'll generate a short, precise, and concise message for you.";

        const payload = {
            prompt: { "messages": [{"content" : text}],
            context: context,
            },
            temperature: 0.1,
            candidate_count: 1,
        };

        const response = await fetch(LANGUAGE_MODEL_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload),
        });

        const data = await response.json();
        //console.log(data);
        //res.send(data);

        // if (data.filters && data.filters.length > 0) {
        //     const filterReason = data.filters[0].reason;
        //     console.log('Filter Reason:', filterReason);

        //     if (filterReason === 'OTHER') {
        //         // Customize your response for "OTHER" filter reason
        //         return res.json({ content: 'I cannot respond to that questions.' });
        //     }
        // }

        res.json(data);
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
