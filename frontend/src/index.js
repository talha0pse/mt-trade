import * as Sentry from '@sentry/react';
import { BrowserTracing } from '@sentry/tracing';
import { withSentryReactRouterV6Routing } from '@sentry/react';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

Sentry.init({
  dsn: process.env.REACT_APP_SENTRY_DSN,
  integrations: [new BrowserTracing()],
  tracesSampleRate: 1.0,
});

const SentryApp = withSentryReactRouterV6Routing(App);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Sentry.ErrorBoundary fallback={<p>An error occurred</p>}>
      <SentryApp />
    </Sentry.ErrorBoundary>
  </React.StrictMode>
);
