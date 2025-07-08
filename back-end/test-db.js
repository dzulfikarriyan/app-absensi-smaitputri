const sequelize = require('./config/database');

const testDatabase = async () => {
  try {
    console.log('🔄 Mencoba koneksi ke database...');
    
    // Test koneksi
    await sequelize.authenticate();
    console.log('✅ Koneksi database berhasil!');
    
    // Test sync database
    console.log('🔄 Sinkronisasi tabel...');
    await sequelize.sync({ force: false });
    console.log('✅ Tabel berhasil disinkronkan!');
    
    // Test query sederhana
    const [results] = await sequelize.query('SELECT 1 as test');
    console.log('✅ Query test berhasil:', results);
    
    console.log('🎉 Database siap digunakan!');
    
  } catch (error) {
    console.error('❌ Error koneksi database:', error.message);
    
    // Berikan saran troubleshooting
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Pastikan MySQL server berjalan');
    console.log('2. Pastikan database "absensi_siswa" sudah dibuat');
    console.log('3. Periksa username dan password MySQL');
    console.log('4. Periksa port MySQL (default: 3306)');
    
    if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 Kemungkinan MySQL server tidak berjalan');
    } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.log('\n💡 Kemungkinan username/password salah');
    } else if (error.code === 'ER_BAD_DB_ERROR') {
      console.log('\n💡 Database "absensi_siswa" belum dibuat');
    }
  } finally {
    process.exit(0);
  }
};

testDatabase(); 