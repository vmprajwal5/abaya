const colors = require('colors');

const BASE_URL = 'http://127.0.0.1:5000/api';

const runTests = async () => {
    console.log('--- STARTING VERIFICATION ---'.yellow.bold);

    // --- Test 1: Invalid Login ---
    console.log('\n--- Test 1: Login with Invalid Credentials ---'.cyan);
    try {
        const res = await fetch(`${BASE_URL}/users/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'admin@example.com', password: 'wrongpassword' })
        });

        const data = await res.json();

        if (res.status === 401) {
            console.log('✅ Success: Received 401 Unauthorized'.green);
            if (data.message === 'Invalid Email or Password') {
                console.log(`✅ Success: Message is "${data.message}"`.green);
            } else {
                console.log(`❌ Fail: Message is "${data.message}" (Expected "Invalid Email or Password")`.red);
            }
        } else {
            console.log(`❌ Fail: Received status ${res.status} (Expected 401)`.red);
        }
    } catch (err) {
        console.log(`❌ Error: ${err.message}`.red);
    }

    // --- Login for Token ---
    let token = '';
    console.log('\n--- Login with VALID Credentials (to get token) ---'.cyan);
    try {
        const res = await fetch(`${BASE_URL}/users/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'admin@example.com', password: 'password123' })
        });
        const data = await res.json();
        if (res.ok) {
            token = data.token;
            console.log('✅ Success: Logged in'.green);
        } else {
            console.log(`❌ Fail: Login failed ${res.status}`.red);
            console.log(data);
            return;
        }
    } catch (err) {
        console.log(`❌ Error: ${err.message}`.red);
        return;
    }

    // --- Get a product ---
    let productId = '';
    let productStock = 0;
    try {
        const res = await fetch(`${BASE_URL}/products`);
        const products = await res.json();
        // Extract products from pagination response if needed
        const productList = products.products || products;

        if (productList.length > 0) {
            productId = productList[productList.length - 1]._id; // Take last one
            productStock = productList[productList.length - 1].stock;
            console.log(`ℹ️  Selected Product ID: ${productId}, Stock: ${productStock}`.blue);
        } else {
            console.log('❌ Fail: No products found'.red);
            return;
        }
    } catch (err) {
        console.log(`❌ Error fetching products: ${err.message}`.red);
    }

    // --- Test 2: Out of Stock Order ---
    console.log('\n--- Test 2: Create Order with quantity > stock ---'.cyan);
    if (!productId) return;

    const hugeQty = productStock + 1000;

    try {
        const orderData = {
            orderItems: [
                {
                    product: productId,
                    name: "Test Product",
                    qty: hugeQty,
                    quantity: hugeQty,
                    image: "/images/sample.jpg",
                    price: 100,
                    size: "M",
                    color: "Black"
                }
            ],
            shippingAddress: { address: "Test", city: "Test", postalCode: "123", country: "Test", state: "male" },
            paymentMethod: "card",
            itemsPrice: 100,
            taxPrice: 0,
            shippingPrice: 0,
            totalPrice: 100
        };

        const res = await fetch(`${BASE_URL}/orders`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(orderData)
        });

        let data;
        try {
            data = await res.json();
        } catch (e) {
            data = { message: "Result not JSON" };
        }

        if (res.status === 400) {
            console.log('✅ Success: Received 400 Bad Request'.green);
            // Check if message contains "out of stock"
            if (data.message && /out of stock/i.test(data.message)) {
                console.log(`✅ Success: Message matches expectations: "${data.message}"`.green);
            } else {
                console.log(`❌ Fail: Message is "${data.message}"`.red);
            }
        } else {
            console.log(`❌ Fail: Received status ${res.status} (Expected 400)`.red);
            console.log('Response:', data);
        }

    } catch (err) {
        console.log(`❌ Error: ${err.message}`.red);
    }
};

runTests();
