import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './AuthContext/AuthContext.jsx';
import { loadStripe } from '@stripe/stripe-js'
import { Elements } from '@stripe/react-stripe-js';

const queryClient = new QueryClient();
const stripeConfig = loadStripe('pk_test_51RtVW2E3ucUpbWemB7BtzUts60tM5G6a4AXZrGN9oRDWYJL7byQMgX8950F8CdpiKLXB73iz3q8pLeLy8L46utbW00bdQuDkxn')

const options = {
  mode: 'payment',
  currency: 'usd',
  amount: 100
};
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Elements stripe={stripeConfig} options={options}>
          <App />
        </Elements>
        </AuthProvider>
    </QueryClientProvider>
  </StrictMode>,
);

