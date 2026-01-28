const express = require('express');
const router = express.Router();
const ticketStore = require('../src/lib/ticketStore');

router.get('/', (req, res) => {
    res.render('index', { title: 'Home' });
});

router.get('/submit', (req, res) => {
    res.render('submit', { title: 'Submit Ticket' });
});

router.post('/submit', async (req, res, next) => {
    try {
        const { name, email, description } = req.body;
        if (!name || !email || !description) {
            return res.status(400).send("All fields required");
        }
        await ticketStore.addTicket({ name, email, description });
        res.redirect('/tickets');
    } catch (err) {
        if (err.code === 'CORRUPT_DATA') {
            return res.status(500).render('error', { title: 'Error', error: err });
        }
        next(err);
    }
});

router.get('/tickets', async (req, res, next) => {
    try {
        const tickets = await ticketStore.getTickets();
        res.render('tickets', { title: 'Ticket List', tickets });
    } catch (err) {
        if (err.code === 'CORRUPT_DATA') {
            return res.status(500).render('error', { title: 'Error', error: err });
        }
        next(err);
    }
});

module.exports = router;
