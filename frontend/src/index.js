// frontend/src/index.js

import * as Sentry from '@sentry/react';
import { BrowserTracing } from '@sentry/tracing';
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// Initialize Sentry before anything else
Sentry.init({
  dsn: process.env.REACT_APP_SENTRY_DSN,
  integrations: [
    new BrowserTracing({
      // Automatically instrument React Router v6
      routingInstrumentation: Sentry.reactRouterV6Instrumentation(window.history),
    }),
  ],
  tracesSampleRate: 1.0,
});

// Create React 18 root
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  // Wrap your app in Sentry’s ErrorBoundary to catch render errors
  <Sentry.ErrorBoundary fallback={<p>An error has occurred</p>}>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </Sentry.ErrorBoundary>
);

// If you want to start measuring performance in your app, pass a function
// to log results (e.g. reportWebVitals(console.log))
reportWebVitals();
