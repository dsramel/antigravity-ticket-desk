const fs = require('fs');
const path = require('path');

const DATA_FILE = path.resolve(__dirname, '../../data/tickets.json');

class TicketStore {
    constructor() {
        this.queue = Promise.resolve();
    }

    // Mutex-like queue for sequential execution
    _enqueue(operation) {
        this.queue = this.queue.then(operation).catch(err => {
            console.error("Store operation failed:", err);
            throw err;
        });
        return this.queue;
    }

    async _read() {
        try {
            const data = await fs.promises.readFile(DATA_FILE, 'utf8');
            return JSON.parse(data);
        } catch (err) {
            if (err.code === 'ENOENT') {
                await this._write([]);
                return [];
            }
            if (err instanceof SyntaxError) {
                const error = new Error(`Data file is corrupt at ${DATA_FILE}. Please fix or delete it.`);
                error.code = 'CORRUPT_DATA';
                error.path = DATA_FILE;
                throw error;
            }
            throw err;
        }
    }

    async _write(data) {
        const tempFile = `${DATA_FILE}.tmp`;
        await fs.promises.writeFile(tempFile, JSON.stringify(data, null, 2));
        await fs.promises.rename(tempFile, DATA_FILE);
    }

    getTickets() {
        return this._enqueue(() => this._read());
    }

    addTicket(ticketInput) {
        return this._enqueue(async () => {
            const tickets = await this._read();
            const newTicket = {
                id: Date.now().toString(),
                created_at: new Date().toISOString(),
                status: 'Open',
                ...ticketInput
            };
            tickets.push(newTicket);
            await this._write(tickets);
            return newTicket;
        });
    }

    updateTicket(id, updates) {
        return this._enqueue(async () => {
            const tickets = await this._read();
            const ticket = tickets.find(t => t.id === id);
            if (!ticket) return false;

            // Only update allowed fields (status)
            if (updates.status) ticket.status = updates.status;

            await this._write(tickets);
            return true;
        });
    }

    deleteTicket(id) {
        return this._enqueue(async () => {
            const tickets = await this._read();
            const filtered = tickets.filter(t => t.id !== id);
            if (filtered.length === tickets.length) return false;

            await this._write(filtered);
            return true;
        });
    }
}

module.exports = new TicketStore();
