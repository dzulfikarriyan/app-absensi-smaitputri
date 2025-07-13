const sequelize = require('./config/database');
const fs = require('fs');
const path = require('path');

async function setupDatabase() {
  try {
    console.log('🔧 Setup database guru dan absensi_guru...');
    
    // Baca file SQL
    const sqlFile = path.join(__dirname, 'create-tables.sql');
    const sqlContent = fs.readFileSync(sqlFile, 'utf8');
    
    // Split SQL menjadi statements
    const statements = sqlContent
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
    
    console.log(`📝 Menjalankan ${statements.length} statement SQL...`);
    
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      if (statement.trim()) {
        try {
          await sequelize.query(statement);
          console.log(`✅ Statement ${i + 1} berhasil`);
        } catch (error) {
          console.log(`⚠️ Statement ${i + 1} error (mungkin sudah ada):`, error.message);
        }
      }
    }
    
    // Verifikasi tabel
    console.log('\n🔍 Verifikasi tabel...');
    
    const tables = await sequelize.showAllSchemas();
    console.log('Tabel yang ada:', tables);
    
    // Cek data guru
    const guruCount = await sequelize.query('SELECT COUNT(*) as count FROM guru', { type: sequelize.QueryTypes.SELECT });
    console.log(`Jumlah guru: ${guruCount[0].count}`);
    
    // Cek data absensi guru
    const absensiCount = await sequelize.query('SELECT COUNT(*) as count FROM absensi_guru', { type: sequelize.QueryTypes.SELECT });
    console.log(`Jumlah absensi guru: ${absensiCount[0].count}`);
    
    // Tampilkan data guru
    const gurus = await sequelize.query('SELECT * FROM guru', { type: sequelize.QueryTypes.SELECT });
    console.log('\n📋 Data guru:');
    gurus.forEach(guru => console.log(`- ${guru.id}: ${guru.nama}`));
    
    // Tampilkan data absensi guru
    const absensi = await sequelize.query(`
      SELECT 
        ag.id,
        g.nama as nama_guru,
        ag.tanggal,
        ag.status,
        ag.keterangan
      FROM absensi_guru ag
      JOIN guru g ON ag.guru_id = g.id
      ORDER BY ag.tanggal DESC, g.nama
    `, { type: sequelize.QueryTypes.SELECT });
    
    console.log('\n📊 Data absensi guru:');
    absensi.forEach(item => {
      console.log(`- ${item.nama_guru}: ${item.status} (${item.tanggal})`);
    });
    
    console.log('\n🎉 Setup database selesai!');
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Error setup database:', error);
    process.exit(1);
  }
}

setupDatabase(); 