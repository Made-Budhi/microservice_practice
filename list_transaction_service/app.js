const express = require('express');
const sequelize = require('./config/db');
const db = require('./models');

const eventTransactionRoutes = require('./routes/event.transaction.route');
const eventProductRoutes = require('./routes/event.product.route');
const eventUserRoutes = require('./routes/event.user.route');
const listTransactionRoutes = require('./routes/list_transaction.route');

const app = express();
app.use(express.json());

app.get('/', (req, res) => res.send('API aktif!'));

app.use('/api/events', eventProductRoutes);
app.use('/api/events', eventUserRoutes);
app.use('/api/events', eventTransactionRoutes);
app.use('/api/list-transactions', listTransactionRoutes)

// Koneksi ke database
sequelize.authenticate()
    .then(() => {
        console.log('✅ Terkoneksi ke MySQL');
        return db.sequelize.sync({ alter: true });
    })
    .then(() => {
        console.log('✅ Sinkronisasi selesai');
    })
    .catch((err) => {
        console.error('❌ Gagal konek:', err);
    });

// Jalankan server
app.listen(4003, () => {
    console.log('🚀 Server jalan di http://localhost:4003');
});