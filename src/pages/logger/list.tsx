import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

type LogItem = {
    message: string;
    log_date: string;
    image_url?: string;
};

export default function LoggerListPage() {
    const [items, setItems] = useState<LogItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchItems() {
            setLoading(true);
            setError(null);
            try {
                const res = await fetch('https://b6jcxrrw74.execute-api.us-east-1.amazonaws.com/logs');
                if (!res.ok) throw new Error('Failed to fetch');
                const data = await res.json();
                setItems(Array.isArray(data.logs) ? data.logs : []);
            } catch (err) {
                setError('Error loading items');
            } finally {
                setLoading(false);
            }
        }
        fetchItems();
    }, []);

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-900">
            <div className="absolute top-6 left-6">
                <button
                    type="button"
                    onClick={() => navigate('/')}
                    className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded transition duration-200"
                >
                    Go to Home
                </button>
            </div>
            <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-2xl">
                <h2 className="text-2xl font-bold text-white text-center mb-6">
                    Logger Items
                </h2>
                {loading && <p className="text-white text-center">Loading...</p>}
                {error && <p className="text-red-400 text-center">{error}</p>}
                <ul className="space-y-6">
                    {items.map((item, idx) => (
                        <li key={idx} className="bg-gray-700 rounded-lg p-4 flex flex-col md:flex-row md:items-center gap-4">
                            <div className="flex-1">
                                <div className="text-white font-semibold mb-2">{item.message}</div>
                                <div className="text-gray-400 text-sm">{new Date(item.log_date).toLocaleString()}</div>
                            </div>
                            {item.image_url && (
                                <img
                                    src={item.image_url}
                                    alt="Uploaded"
                                    className="w-32 h-32 object-cover rounded border border-gray-600"
                                />
                            )}
                        </li>
                    ))}
                    {!loading && items.length === 0 && (
                        <li className="text-gray-400 text-center">No items found.</li>
                    )}
                </ul>
            </div>
        </div>
    );
}