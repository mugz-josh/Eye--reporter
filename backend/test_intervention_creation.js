const fetch = require('node-fetch');
const FormData = require('form-data');
const fs = require('fs');

async function testInterventionCreation() {
  const API_URL = 'http://localhost:3000/api';

  try {
    console.log('🧪 Testing intervention creation...');

    // First, login to get a token
    console.log('🔐 Logging in...');
    const loginResponse = await fetch(`${API_URL}/v1/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'test123'
      })
    });

    const loginData = await loginResponse.json();
    if (!loginData.data || !loginData.data.token) {
      console.log('❌ Login failed:', loginData);
      return;
    }

    const token = loginData.data.token;
    console.log('✅ Login successful, got token');

    // Now create an intervention
    console.log('📝 Creating intervention...');
    const formData = new FormData();
    formData.append('title', 'Test Intervention from API');
    formData.append('description', 'This is a test intervention created via API');
    formData.append('latitude', '40.7128');
    formData.append('longitude', '-74.0060');

    const createResponse = await fetch(`${API_URL}/v1/interventions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });

    const createData = await createResponse.json();
    console.log('📊 Create response:', createData);

    if (createData.status === 201) {
      console.log('✅ Intervention creation successful!');
      console.log('🎉 The database migration fixed the issue.');
    } else {
      console.log('❌ Intervention creation failed:', createData);
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testInterventionCreation();
