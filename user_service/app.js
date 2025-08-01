const express = require('express');
const sequelize = require('./config/db');
const db = require('./models');
// import file route disinihttps://docs.google.com/document/d/1wGRzQcfJzPpDQE1x_0lXlZ8bE3CJgBh-71iG_Jc4M6M/edit?tab=t.0
const userRoutes = require('./routes/user.route');


const app = express();
app.use(express.json());

app.get('/', (req, res) => res.send('API aktif!'));

// tambahkan routing kamu dibawah sini
app.use('/api/users', userRoutes);


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
app.listen(4002, () => {
  console.log('🚀 Server jalan di http://localhost:4002');
});
