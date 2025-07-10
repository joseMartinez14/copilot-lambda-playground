import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoggerPage from '../pages/logger';
import LoggerListPage from '../pages/logger/list';

function Home() {
    return <h1>hello work</h1>;
}

export default function AppRouter() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/home" element={<Home />} />
                <Route path="/" element={<LoggerPage />} />
                <Route path="/get_log" element={<LoggerListPage />} />
            </Routes>
        </BrowserRouter>
    );
}