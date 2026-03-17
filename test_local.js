async function testLocal() {
    try {
        const res = await fetch('http://localhost:5000/api/health');
        if (!res.ok) {
            console.log(`[${res.status}] Local 5000 /api/health HTTP Error`);
            return;
        }
        const text = await res.text();
        console.log(`[${res.status}] Local 5000 /api/health -> ${text.substring(0, 150)}`);
    } catch (e) {
        console.error(`ERROR Local 5000 /api/health -> ${e.message}`);
    }
}
testLocal();
