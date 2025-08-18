import axios from 'axios';

export const handleFreeSubscriptionAPI = async () => {
    const response = await axios.post('/api/free-plan', {}, {
        withCredentials: true
    });

    return response?.data;
};

export const handlePaymentIntentAPI = async (payment) => {
    const response = await axios.post('/api/payment-checkout', {
        amount: Number(payment?.amount),
        subscriptionPlan: payment?.plan
    }, {
        withCredentials: true
    });

    return response?.data;
};

export const verifyPaymentAPI = async (paymentId) => {
    const response = await axios.post(`/api/verify-payment/${paymentId}`, {}, {
        withCredentials: true
    });

    return response?.data;
};