import React, { useState } from "react";
import { useParams, useSearchParams } from 'react-router-dom';
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useMutation } from '@tanstack/react-query';
import { handlePaymentIntentAPI } from "../../API/payment/paymentAPI";
import StatusMessage from '../Alert/StatusMessage';

const CheckoutForm = () => {
  const params = useParams();
  const [searchParams] = useSearchParams();
  const plan = params.plan;
  const amount = searchParams.get('amount');

  const stripe = useStripe();
  const elements = useElements();
  const [errorMessage, setErrorMessage] = useState(null);

  const mutation = useMutation({
    mutationFn: handlePaymentIntentAPI,
    mutationKey: ['payment-checkout']
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!elements || !stripe) return;

    const { error: submitError } = await elements.submit();
    if (submitError) {
      setErrorMessage(submitError.message);
      return;
    }

    try {
      const payload = { plan, amount };
      const response = await mutation.mutateAsync(payload);

      const { error } = await stripe.confirmPayment({
        elements,
        clientSecret: response?.clientSecret,
        confirmParams: {
          return_url: 'https://gemai-web-app.onrender.com/payment-success',
        },
      });

      if (error) {
        setErrorMessage(error.message);
      }
    } catch (error) {
      setErrorMessage(error.message || 'Payment failed');
      console.error(error);
    }
  };

  return (
    <div className="h-screen bg-gradient-to-br from-gray-950 to-gray-900 flex justify-center items-center">
      <form onSubmit={handleSubmit} className="w-96 mx-auto p-6 bg-white rounded-lg shadow-lg">
        <div className="mb-4">
          <PaymentElement />
        </div>

        {mutation.isPending && (
          <StatusMessage type="loading" message="Payment under processing..." />
        )}

        {mutation.isError && (
          <StatusMessage type="error" message={mutation.error?.response?.data?.message || 'Payment failed'} />
        )}

        <button
          type="submit"
          className="block mt-5 w-full text-center rounded-md bg-gradient-to-bl
          from-violet-500 to-fuchsia-500 px-4 py-2 text-sm font-bold text-white shadow
          hover:scale-105 duration-100 ease-linear"
        >
          Pay
        </button>

        {errorMessage && (
          <div className="text-red-500 font-semibold mt-4">{errorMessage}</div>
        )}
      </form>
    </div>
  );
};

export default CheckoutForm;
