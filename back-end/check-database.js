const sequelize = require('./config/database');
const { Guru, AbsensiGuru } = require('./models');

async function checkAndCreateTables() {
  try {
    console.log('🔍 Memeriksa koneksi database...');
    await sequelize.authenticate();
    console.log('✅ Koneksi database berhasil');

    console.log('\n📋 Memeriksa tabel yang ada...');
    const tables = await sequelize.showAllSchemas();
    console.log('Tabel yang ada:', tables);

    console.log('\n🔄 Sinkronisasi model dengan database...');
    await sequelize.sync({ force: false });
    console.log('✅ Sinkronisasi berhasil');

    // Cek apakah tabel guru ada
    const guruTableExists = await sequelize.getQueryInterface().showAllTables()
      .then(tables => tables.includes('guru'));
    
    if (!guruTableExists) {
      console.log('\n📝 Membuat tabel guru...');
      await sequelize.getQueryInterface().createTable('guru', {
        id: {
          type: sequelize.Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        nama: {
          type: sequelize.Sequelize.STRING(100),
          allowNull: false
        },
        created_at: {
          type: sequelize.Sequelize.DATE,
          allowNull: false,
          defaultValue: sequelize.Sequelize.NOW
        },
        updated_at: {
          type: sequelize.Sequelize.DATE,
          allowNull: false,
          defaultValue: sequelize.Sequelize.NOW
        }
      });
      console.log('✅ Tabel guru berhasil dibuat');
    } else {
      console.log('✅ Tabel guru sudah ada');
    }

    // Cek apakah tabel absensi_guru ada
    const absensiGuruTableExists = await sequelize.getQueryInterface().showAllTables()
      .then(tables => tables.includes('absensi_guru'));
    
    if (!absensiGuruTableExists) {
      console.log('\n📝 Membuat tabel absensi_guru...');
      await sequelize.getQueryInterface().createTable('absensi_guru', {
        id: {
          type: sequelize.Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        guru_id: {
          type: sequelize.Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: 'guru',
            key: 'id'
          }
        },
        tanggal: {
          type: sequelize.Sequelize.DATEONLY,
          allowNull: false
        },
        status: {
          type: sequelize.Sequelize.ENUM('hadir', 'sakit', 'izin', 'alpa', 'terlambat'),
          allowNull: false
        },
        keterangan: {
          type: sequelize.Sequelize.STRING(255),
          allowNull: true
        },
        created_at: {
          type: sequelize.Sequelize.DATE,
          allowNull: false,
          defaultValue: sequelize.Sequelize.NOW
        },
        updated_at: {
          type: sequelize.Sequelize.DATE,
          allowNull: false,
          defaultValue: sequelize.Sequelize.NOW
        }
      });
      console.log('✅ Tabel absensi_guru berhasil dibuat');
    } else {
      console.log('✅ Tabel absensi_guru sudah ada');
    }

    // Cek data guru
    console.log('\n👥 Memeriksa data guru...');
    const guruCount = await Guru.count();
    console.log(`Jumlah guru: ${guruCount}`);

    if (guruCount === 0) {
      console.log('📝 Menambahkan data guru contoh...');
      await Guru.bulkCreate([
        { nama: 'Ahmad Supriadi' },
        { nama: 'Siti Nurhaliza' },
        { nama: 'Budi Santoso' },
        { nama: 'Dewi Sartika' },
        { nama: 'Rudi Hermawan' }
      ]);
      console.log('✅ Data guru contoh berhasil ditambahkan');
    }

    // Cek data absensi guru
    console.log('\n📊 Memeriksa data absensi guru...');
    const absensiGuruCount = await AbsensiGuru.count();
    console.log(`Jumlah absensi guru: ${absensiGuruCount}`);

    if (absensiGuruCount === 0) {
      console.log('📝 Menambahkan data absensi guru contoh...');
      const gurus = await Guru.findAll();
      const today = new Date().toISOString().split('T')[0];
      
      for (const guru of gurus) {
        await AbsensiGuru.create({
          guru_id: guru.id,
          tanggal: today,
          status: 'hadir',
          keterangan: 'Hadir tepat waktu'
        });
      }
      console.log('✅ Data absensi guru contoh berhasil ditambahkan');
    }

    console.log('\n🎉 Pemeriksaan database selesai!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

checkAndCreateTables(); 