const axios = require('axios');

async function testAuth() {
    const API_URL = 'http://localhost:3001';
    const testUser = {
        email: 'test@blendwit.com',
        password: 'password123',
        name: 'Test User'
    };

    try {
        console.log('--- Testing Registration ---');
        const registerRes = await axios.post(`${API_URL}/auth/register`, testUser).catch(e => e.response);
        console.log('Register Status:', registerRes.status);
        console.log('Register Body:', registerRes.data);

        console.log('\n--- Testing Login ---');
        const loginRes = await axios.post(`${API_URL}/auth/login`, {
            email: testUser.email,
            password: testUser.password
        }).catch(e => e.response);
        console.log('Login Status:', loginRes.status);
        console.log('Login Body:', loginRes.data);

        if (loginRes.data.access_token) {
            console.log('\n--- Testing Profile (Protected) ---');
            const profileRes = await axios.post(`${API_URL}/auth/profile`, {}, {
                headers: { Authorization: `Bearer ${loginRes.data.access_token}` }
            }).catch(e => e.response);
            console.log('Profile Status:', profileRes.status);
            console.log('Profile Body:', profileRes.data);
        }

    } catch (error) {
        console.error('Test failed:', error.message);
    }
}

// Note: This script requires the backend to be running and connected to a DB.
// testAuth();
