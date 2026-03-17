const API_URL = 'http://localhost:5000/api';

async function runTests() {
  console.log('--- STARTING BACKEND TESTS ---');
  let token = null;
  const testEmail = `test${Date.now()}@test.com`;
  const testPassword = 'TestPass123!@#';

  // 1. REGISTER
  try {
    console.log('\nTesting /api/auth/register...');
    const res = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Test User', email: testEmail, password: testPassword })
    });
    const data = await res.json();
    console.log(`Status: ${res.status}`, data.success ? '✅ Success' : '❌ Failed', data.message || '');
  } catch (e) {
    console.error('Register failed', e.message);
  }

  // 2. LOGIN
  try {
    console.log('\nTesting /api/auth/login...');
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: testEmail, password: testPassword })
    });
    const data = await res.json();
    console.log(`Status: ${res.status}`, data.success ? '✅ Success' : '❌ Failed', data.message || '');
    if (res.ok && data.token) {
        token = data.token;
    }
  } catch (e) {
    console.error('Login failed', e.message);
  }

  // 3. WRONG PASSWORD LOGIN
  try {
    console.log('\nTesting /api/auth/login (wrong password)...');
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: testEmail, password: 'wrongpassword' })
    });
    const data = await res.json();
    console.log(`Status: ${res.status}`, res.status === 401 ? '✅ Expected 401' : '❌ Failed', data.message || '');
  } catch (e) {
    console.error('Wrong pass login failed', e.message);
  }

  // 4. GET PRODUCTS
  let productId = null;
  try {
    console.log('\nTesting /api/products...');
    const res = await fetch(`${API_URL}/products`);
    const data = await res.json();
    console.log(`Status: ${res.status}`, Array.isArray(data) ? `✅ Found ${data.length} products` : '❌ Failed');
    if (Array.isArray(data) && data.length > 0) {
        productId = data[0]._id;
    }
  } catch (e) {
    console.error('Get products failed', e.message);
  }

  // 5. GET SINGLE PRODUCT
  if (productId) {
      try {
        console.log(`\nTesting /api/products/${productId}...`);
        const res = await fetch(`${API_URL}/products/${productId}`);
        const data = await res.json();
        console.log(`Status: ${res.status}`, data._id ? '✅ Success' : '❌ Failed');
      } catch (e) {
        console.error('Get single product failed', e.message);
      }
  }

  // 6. GET ORDERS (needs token)
  if (token) {
      try {
        console.log('\nTesting /api/orders/my-orders...');
        const res = await fetch(`${API_URL}/orders/my-orders`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        console.log(`Status: ${res.status}`, Array.isArray(data) ? '✅ Success' : '❌ Failed', data._message || '');
      } catch (e) {
         console.error('Get orders failed', e.message);
      }
  } else {
      console.log('\nSkipping orders test, missing token.');
  }

}

runTests();
