const axios = require('axios');
const fs = require('fs');

async function testExcelDownload() {
  try {
    console.log('Testing Excel download functionality...');
    
    // Test parameters
    const params = {
      start_date: '2024-01-01',
      end_date: '2024-12-31'
    };
    
    console.log('Making request to download Excel...');
    const response = await axios.get('http://localhost:3002/api/absensi-guru/download-excel', {
      params,
      responseType: 'stream'
    });
    
    console.log('Response status:', response.status);
    console.log('Content-Type:', response.headers['content-type']);
    console.log('Content-Disposition:', response.headers['content-disposition']);
    
    // Save the file
    const filename = 'test_rekap_absensi_guru.xlsx';
    const writer = fs.createWriteStream(filename);
    response.data.pipe(writer);
    
    writer.on('finish', () => {
      console.log(`Excel file saved as: ${filename}`);
      console.log('Excel download test completed successfully!');
    });
    
    writer.on('error', (error) => {
      console.error('Error saving file:', error);
    });
    
  } catch (error) {
    console.error('Error testing Excel download:', error.response?.data || error.message);
  }
}

// Wait a bit for server to start, then test
setTimeout(testExcelDownload, 3000); 