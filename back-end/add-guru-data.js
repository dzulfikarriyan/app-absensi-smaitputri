const { Sequelize } = require('sequelize');

// Koneksi ke database absensi_guru
const sequelize = new Sequelize(
  'absensi_guru',
  'root',
  'Sukses!@#99',
  {
    host: 'localhost',
    port: 3307,
    dialect: 'mysql',
    logging: false
  }
);

async function addGuruData() {
  try {
    console.log('🔧 Menambahkan data guru ke database absensi_guru...');
    
    // Test koneksi
    await sequelize.authenticate();
    console.log('✅ Koneksi database berhasil');
    
    // Tambah data guru
    const guruData = [
      { nama: 'Ahmad Supriadi' },
      { nama: 'Siti Nurhaliza' },
      { nama: 'Budi Santoso' },
      { nama: 'Dewi Sartika' },
      { nama: 'Rudi Hermawan' },
      { nama: 'Nina Safitri' },
      { nama: 'Agus Setiawan' },
      { nama: 'Maya Indah' }
    ];
    
    console.log('📝 Menambahkan data guru...');
    for (const guru of guruData) {
      await sequelize.query(
        'INSERT IGNORE INTO guru (nama) VALUES (?)',
        {
          replacements: [guru.nama],
          type: Sequelize.QueryTypes.INSERT
        }
      );
      console.log(`✅ Guru "${guru.nama}" ditambahkan`);
    }
    
    // Tambah data absensi guru untuk hari ini
    console.log('\n📊 Menambahkan data absensi guru untuk hari ini...');
    const today = new Date().toISOString().split('T')[0];
    
    const gurus = await sequelize.query('SELECT id, nama FROM guru', { 
      type: Sequelize.QueryTypes.SELECT 
    });
    
    for (const guru of gurus) {
      // Cek apakah sudah ada absensi untuk hari ini
      const existing = await sequelize.query(
        'SELECT id FROM absensiguru WHERE guru_id = ? AND tanggal = ?',
        {
          replacements: [guru.id, today],
          type: Sequelize.QueryTypes.SELECT
        }
      );
      
      if (existing.length === 0) {
        await sequelize.query(
          'INSERT INTO absensiguru (guru_id, tanggal, status, keterangan) VALUES (?, ?, ?, ?)',
          {
            replacements: [guru.id, today, 'hadir', 'Hadir tepat waktu'],
            type: Sequelize.QueryTypes.INSERT
          }
        );
        console.log(`✅ Absensi guru "${guru.nama}" ditambahkan`);
      } else {
        console.log(`⚠️ Absensi guru "${guru.nama}" sudah ada untuk hari ini`);
      }
    }
    
    // Tampilkan hasil
    console.log('\n📋 Data guru yang ada:');
    const allGurus = await sequelize.query('SELECT * FROM guru ORDER BY nama', { 
      type: Sequelize.QueryTypes.SELECT 
    });
    allGurus.forEach(guru => console.log(`- ${guru.id}: ${guru.nama}`));
    
    console.log('\n📊 Data absensi guru:');
    const allAbsensi = await sequelize.query(`
      SELECT 
        ag.id,
        g.nama as nama_guru,
        ag.tanggal,
        ag.status,
        ag.keterangan
      FROM absensiguru ag
      JOIN guru g ON ag.guru_id = g.id
      ORDER BY ag.tanggal DESC, g.nama
    `, { type: Sequelize.QueryTypes.SELECT });
    
    allAbsensi.forEach(item => {
      console.log(`- ${item.nama_guru}: ${item.status} (${item.tanggal})`);
    });
    
    console.log('\n🎉 Data guru berhasil ditambahkan!');
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

addGuruData(); 