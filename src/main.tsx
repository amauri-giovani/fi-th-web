// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { App } from './App';
import { CompanyGroupsPage } from './pages/CompanyGroupsPage';


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/companies/groups" element={<CompanyGroupsPage />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
);
