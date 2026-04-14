const express = require('express');
const sql     = require('mssql');
const router  = express.Router();

const tableConfig = {
    mahasiswa: {
        table:    'Mahasiswa',
        pk:       'nim',
        identity: false,
        columns:  ['nim', 'nama', 'alamat']
    },
    dosen: {
        table:    'Dosen',
        pk:       'nip',
        identity: false,
        columns:  ['nip', 'nama', 'alamat']
    },
    matakuliah: {
        table:    'Mata_Kuliah',
        pk:       'kode',
        identity: false,
        columns:  ['kode', 'matkul', 'sks', 'smt']
    },
    perkuliahan: {
        table:    'Perkuliahan',
        pk:       'id',
        identity: true,
        columns:  ['id', 'nim', 'nip', 'kode', 'nilai']
    }
};

const fkMessages = {
    nim:  'Mahasiswa ini masih terdaftar dalam data perkuliahan.',
    nip:  'Dosen ini masih terdaftar dalam data perkuliahan.',
    kode: 'Mata kuliah ini masih terdaftar dalam data perkuliahan.',
};

// Deteksi apakah error adalah FK constraint
function getFKError(err) {
    if (err.number !== 547 && !err.message.includes('REFERENCE constraint')) return null;

    // Cari kolom yang menyebabkan konflik
    for (const [col, message] of Object.entries(fkMessages)) {
        if (err.message.includes(`column '${col}'`)) {
            return { type: 'fk_violation', column: col, message };
        }
    }

    // Fallback
    return {
        type: 'fk_violation',
        column: null,
        message: 'Data ini masih dirujuk oleh tabel lain.'
    };
}

Object.entries(tableConfig).forEach(([endpoint, config]) => {
    const { table, pk, identity, columns } = config;

    // ─── READ ───
    router.get(`/${endpoint}`, async (req, res) => {
        try {
            const result = await sql.query(`SELECT * FROM ${table}`);
            res.json(result.recordset);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    });

    // ─── CREATE ───
    router.post(`/${endpoint}`, async (req, res) => {
        try {
            const body       = req.body;
            const insertCols = identity ? columns.filter(c => c !== pk) : columns;
            const request    = new sql.Request();
            insertCols.forEach(col => request.input(col, body[col]));
            const colList   = insertCols.join(', ');
            const paramList = insertCols.map(c => `@${c}`).join(', ');
            await request.query(`INSERT INTO ${table} (${colList}) VALUES (${paramList})`);
            res.status(201).json({ message: 'Data berhasil ditambahkan.' });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    });

    // ─── UPDATE ───
    router.put(`/${endpoint}/:id`, async (req, res) => {
        try {
            const body       = req.body;
            const id         = req.params.id;
            const request    = new sql.Request();
            const updateCols = columns.filter(c => c !== pk);
            updateCols.forEach(col => request.input(col, body[col]));
            request.input('pkVal', id);
            const setClause = updateCols.map(c => `${c} = @${c}`).join(', ');
            await request.query(`UPDATE ${table} SET ${setClause} WHERE ${pk} = @pkVal`);
            res.json({ message: 'Data berhasil diperbarui.' });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    });

    // ─── DELETE ───
    router.delete(`/${endpoint}/:id`, async (req, res) => {
        try {
            const request = new sql.Request();
            request.input('pkVal', req.params.id);
            await request.query(`DELETE FROM ${table} WHERE ${pk} = @pkVal`);
            res.json({ message: 'Data berhasil dihapus.' });
        } catch (err) {
            const fkError = getFKError(err);
            if (fkError) {
                return res.status(409).json(fkError);
            }
            res.status(500).json({ error: err.message });
        }
    });
});

module.exports = router;