import React, { useState } from 'react';

// Returns local datetime in ISO format for input[type="datetime-local"], using Costa Rica's timezone (UTC-6)
function getNowLocalISOString() {
    const now = new Date();
    // Costa Rica is UTC-6, so adjust the time accordingly
    const offset = now.getTimezoneOffset() / 60; // in hours
    // If not already UTC-6, adjust
    const crOffset = -6;
    const diff = crOffset - (-offset);
    now.setHours(now.getHours() + diff);
    now.setSeconds(0, 0); // Remove seconds and ms for input compatibility
    return now.toISOString().slice(0, 16);
}

export default function LoggerPage() {
    const [message, setMessage] = useState('');
    const [image, setImage] = useState<File | null>(null);
    const [datetime, setDatetime] = useState(getNowLocalISOString());
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        let imageBase64 = '';
        if (image) {
            imageBase64 = await toBase64(image);
        }

        const payload = {
            message,
            image: imageBase64,
            datetime,
        };

        try {
            await fetch('https://b6jcxrrw74.execute-api.us-east-1.amazonaws.com/logger', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });
            alert('Form submitted!');
        } catch (err) {
            alert('Error submitting form');
        } finally {
            setLoading(false);
        }
    };

    function toBase64(file: File): Promise<string> {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                // Remove the "data:*/*;base64," prefix if you want only the base64 string
                const result = reader.result as string;
                resolve(result.split(',')[1]);
            };
            reader.onerror = error => reject(error);
        });
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-900">
            <form
                className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md space-y-6"
                onSubmit={handleSubmit}
            >
                <h2 className="text-2xl font-bold text-white text-center mb-4">
                    Save on serverless aws lambda
                </h2>
                <div>
                    <label htmlFor="message" className="block text-white text-lg font-semibold mb-2">
                        Message
                    </label>
                    <textarea
                        id="message"
                        name="message"
                        rows={8}
                        className="w-full p-3 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        placeholder="Type your message..."
                        value={message}
                        onChange={e => setMessage(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="image" className="block text-white text-lg font-semibold mb-2">
                        Image
                    </label>
                    <input
                        type="file"
                        id="image"
                        name="image"
                        accept="image/*"
                        className="w-full text-white"
                        onChange={e => setImage(e.target.files ? e.target.files[0] : null)}
                    />
                </div>
                <div>
                    <label htmlFor="datetime" className="block text-white text-lg font-semibold mb-2">
                        Date & Time
                    </label>
                    <input
                        type="datetime-local"
                        id="datetime"
                        name="datetime"
                        value={datetime}
                        onChange={e => setDatetime(e.target.value)}
                        className="w-full p-3 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-200"
                    disabled={loading}
                >
                    {loading ? 'Submitting...' : 'Submit'}
                </button>
            </form>
        </div>
    );
}