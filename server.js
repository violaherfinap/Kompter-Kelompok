const express = require('express');
const sql = require('mssql/msnodesqlv8');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.static(__dirname));

const dbConfig = {
    server: 'VIOOUW',
    database: 'KOMPTER_INDVIDU',
    driver: 'SQL Server',
    options: {
        trustedConnection: true,
        trustServerCertificate: true
    }
};

// Hubungkan ke Database
sql.connect(dbConfig).then(() => {
    console.log('Database SQL Server (Windows Auth) Terkoneksi!');
}).catch(err => {
    console.error('Koneksi Database Gagal:', err);
});

// Endpoint untuk masing-masing tabel
app.get('/api/mahasiswa', async (req, res) => {
    try {
        const result = await sql.query('SELECT * FROM Mahasiswa');
        res.json(result.recordset);
    } catch (err) { res.status(500).send(err.message); }
});

app.get('/api/dosen', async (req, res) => {
    try {
        const result = await sql.query('SELECT * FROM Dosen');
        res.json(result.recordset);
    } catch (err) { res.status(500).send(err.message); }
});

app.get('/api/matakuliah', async (req, res) => {
    try {
        const result = await sql.query('SELECT * FROM Mata_Kuliah');
        res.json(result.recordset);
    } catch (err) { res.status(500).send(err.message); }
});

app.get('/api/perkuliahan', async (req, res) => {
    try {
        const result = await sql.query('SELECT * FROM Perkuliahan');
        res.json(result.recordset);
    } catch (err) { res.status(500).send(err.message); }
});

// Menjalankan server
app.listen(3000, () => {
    console.log('Backend berjalan di http://localhost:3000');
});