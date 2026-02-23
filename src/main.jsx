import React from 'react';
import { createRoot } from 'react-dom/client';
import SignUp from './SignUp';
import './styles.css';

const mount = document.getElementById('auth-react-root');

// If 'auth-react-root' exists (as seen in previous version), use it.
// Otherwise fallback to 'root' which is standard Vite
const rootElement = mount || document.getElementById('root');

if (rootElement) {
  const root = createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <SignUp />
    </React.StrictMode>
  );
} else {
  console.error("Root element not found");
}
