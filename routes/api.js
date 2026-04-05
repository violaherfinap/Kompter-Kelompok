const express = require('express');
const sql = require('mssql');
const router = express.Router();

const tables = {
    mahasiswa:   'SELECT * FROM Mahasiswa',
    dosen:       'SELECT * FROM Dosen',
    matakuliah:  'SELECT * FROM Mata_Kuliah',
    perkuliahan: 'SELECT * FROM Perkuliahan',
};

Object.entries(tables).forEach(([endpoint, query]) => {
    router.get(`/${endpoint}`, async (req, res) => {
        try {
            const result = await sql.query(query);
            res.json(result.recordset);
        } catch (err) {
            res.status(500).send(err.message);
        }
    });
});

module.exports = router;