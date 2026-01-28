const express = require('express');
const router = express.Router();
const ticketStore = require('../src/lib/ticketStore');

router.get('/tickets', async (req, res, next) => {
    try {
        const tickets = await ticketStore.getTickets();
        res.json(tickets);
    } catch (err) {
        if (err.code === 'CORRUPT_DATA') {
            return res.status(500).render('error', { title: 'Error', error: err });
        }
        next(err);
    }
});

module.exports = router;
