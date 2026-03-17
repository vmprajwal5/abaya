async function testEndpoints() {
  const urls = [
      'https://abaya-xthd.onrender.com/',
      'https://abaya-xthd.onrender.com/api/health',
      'https://abaya-xthd.onrender.com/api/products'
  ];

  for (const url of urls) {
      try {
          console.log(`Testing: ${url}`);
          const res = await fetch(url);
          if (!res.ok) {
              console.log(`[${res.status}] ${url} -> HTTP Error`);
              continue;
          }
          const text = await res.text();
          console.log(`[${res.status}] ${url} -> ${text.substring(0, 150)}`);
      } catch (e) {
          console.error(`ERROR ${url} -> ${e.message}`);
      }
  }
}
testEndpoints();
