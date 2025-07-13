const http = require('http');

function testBatchGuruAPI() {
  const data = JSON.stringify({
    guru_list: [
      { nama: 'Guru Test 1' },
      { nama: 'Guru Test 2' },
      { nama: 'Guru Test 3' },
      { nama: '' }, // Test empty name
      { nama: 'Guru Test 4' }
    ]
  });

  const options = {
    hostname: 'localhost',
    port: 3002,
    path: '/api/guru/batch',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': data.length
    }
  };

  const req = http.request(options, (res) => {
    console.log(`Status: ${res.statusCode}`);
    console.log(`Headers:`, res.headers);

    let responseData = '';
    res.on('data', (chunk) => {
      responseData += chunk;
    });

    res.on('end', () => {
      try {
        const response = JSON.parse(responseData);
        console.log('Response:', JSON.stringify(response, null, 2));
      } catch (error) {
        console.log('Raw response:', responseData);
      }
    });
  });

  req.on('error', (error) => {
    console.error('Error:', error.message);
  });

  req.write(data);
  req.end();
}

console.log('🧪 Testing Batch Add Guru API...');
testBatchGuruAPI(); 