const express = require('express');
const router = express.Router();
const ticketStore = require('../src/lib/ticketStore');

// Middleware to check if admin is logged in
function isAuthenticated(req, res, next) {
    if (req.session.isAdmin) {
        next();
    } else {
        res.redirect('/admin/login');
    }
}

router.get('/login', (req, res) => {
    res.render('login', { title: 'Admin Login', error: null });
});

router.post('/login', (req, res) => {
    const { password } = req.body;
    if (password === process.env.ADMIN_PASSWORD) {
        req.session.isAdmin = true;
        res.redirect('/admin');
    } else {
        res.render('login', { title: 'Admin Login', error: 'Invalid Password' });
    }
});

router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

router.get('/', isAuthenticated, async (req, res, next) => {
    try {
        const tickets = await ticketStore.getTickets();
        res.render('admin', { title: 'Admin Dashboard', tickets });
    } catch (err) {
        if (err.code === 'CORRUPT_DATA') {
            return res.status(500).render('error', { title: 'Error', error: err });
        }
        next(err);
    }
});

router.post('/ticket/:id/update', isAuthenticated, async (req, res, next) => {
    try {
        const { status } = req.body;
        await ticketStore.updateTicket(req.params.id, { status });
        res.redirect('/admin');
    } catch (err) {
        if (err.code === 'CORRUPT_DATA') {
            return res.status(500).render('error', { title: 'Error', error: err });
        }
        next(err);
    }
});

router.post('/ticket/:id/delete', isAuthenticated, async (req, res, next) => {
    try {
        await ticketStore.deleteTicket(req.params.id);
        res.redirect('/admin');
    } catch (err) {
        if (err.code === 'CORRUPT_DATA') {
            return res.status(500).render('error', { title: 'Error', error: err });
        }
        next(err);
    }
});

module.exports = router;
