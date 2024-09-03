import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import '@/styles/main.css';

import App from '/App';

const domNode = document.getElementById('react-app');

createRoot(domNode).render(
  <StrictMode>
    <Router>
      <App />
    </Router>
  </StrictMode>
);
