import React from 'react';
import { createRoot } from 'react-dom/client';
import '../index.css';

// Import the same App component from popup
// Since the side panel has the same functionality, we can reuse the component
import App from '../popup/popup';

const root = createRoot(document.getElementById('root')!);
root.render(<App />);