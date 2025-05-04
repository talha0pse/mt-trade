// frontend/src/index.js

import * as Sentry from '@sentry/react';
import { browserTracingIntegration } from '@sentry/react';
import { withSentryReactRouterV6Routing } from '@sentry/react';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// 1. Initialize Sentry, using the functional browserTracingIntegration
Sentry.init({
  dsn: process.env.REACT_APP_SENTRY_DSN,
  integrations: [browserTracingIntegration()],
  tracesSampleRate: 1.0,
});

// 2. Wrap your App for React Router v6 instrumentation
const SentryApp = withSentryReactRouterV6Routing(App);

// 3. Render
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Sentry.ErrorBoundary fallback={<p>An error has occurred</p>}>
      <SentryApp />
    </Sentry.ErrorBoundary>
  </React.StrictMode>
);
