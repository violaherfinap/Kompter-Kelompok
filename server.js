require('dotenv').config();
const express   = require('express');
const sql       = require('mssql');
const cors      = require('cors');
const dbConfig  = require('./config/db');
const apiRoutes = require('./routes/api');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));
app.use('/api', apiRoutes);

sql.connect(dbConfig)
    .then(() => console.log('Database terkoneksi!'))
    .catch(err => console.error('Koneksi gagal:', err));

app.listen(process.env.PORT, () => {
    console.log(`Backend berjalan di http://localhost:${process.env.PORT}`);
});