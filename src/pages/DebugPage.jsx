import { useState, useEffect } from 'react';
import { productAPI } from '../services/api';

export function DebugPage() {
    const [status, setStatus] = useState('Checking...');
    const [products, setProducts] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const checkAPI = async () => {
            try {
                // 1. Check raw fetch to localhost
                const res = await fetch('http://localhost:5000/api/health');
                const health = await res.json();
                setStatus(`Backend Connected: ${health.message}`);

                // 2. Fetch Products via Service
                const items = await productAPI.getAll();
                setProducts(items);
            } catch (err) {
                console.error(err);
                setError(err.message);
                setStatus('Failed to connect');
            }
        };
        checkAPI();
    }, []);

    return (
        <div className="pt-32 px-8">
            <h1 className="text-2xl font-bold mb-4">System Debug</h1>

            <div className="p-4 border mb-4 rounded bg-gray-50">
                <h2 className="font-bold">Status:</h2>
                <p className={error ? "text-red-500" : "text-green-500"}>{status}</p>
                {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            </div>

            <div className="p-4 border rounded bg-gray-50">
                <h2 className="font-bold mb-2">Products ({products?.length || 0}):</h2>
                <pre className="text-xs overflow-auto h-96 bg-gray-900 text-green-400 p-4 rounded">
                    {JSON.stringify(products, null, 2)}
                </pre>
            </div>
        </div>
    );
}
