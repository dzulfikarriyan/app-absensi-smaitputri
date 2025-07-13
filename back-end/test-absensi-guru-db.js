const { Sequelize } = require('sequelize');

// Test koneksi ke database absensi_guru
const sequelize = new Sequelize(
  'absensi_guru',
  'root',
  'Sukses!@#99',
  {
    host: 'localhost',
    port: 3307,
    dialect: 'mysql',
    logging: console.log
  }
);

async function testDatabase() {
  try {
    console.log('🔍 Testing koneksi ke database absensi_guru...');
    await sequelize.authenticate();
    console.log('✅ Koneksi ke database absensi_guru berhasil!');

    // Cek tabel yang ada
    console.log('\n📋 Tabel yang ada di database absensi_guru:');
    const tables = await sequelize.showAllSchemas();
    console.log(tables);

    // Cek data guru
    console.log('\n👥 Data guru:');
    const gurus = await sequelize.query('SELECT * FROM guru', { type: Sequelize.QueryTypes.SELECT });
    console.log(gurus);

    // Cek data absensi guru
    console.log('\n📊 Data absensi guru:');
    const absensi = await sequelize.query(`
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
    console.log(absensi);

    console.log('\n🎉 Test database selesai!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

testDatabase(); 