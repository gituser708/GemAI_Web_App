import axios from 'axios';

export const handleFreeSubscriptionAPI = async () => {
    const response = await axios.post('https://gemai-server.onrender.com/api/free-plan', {}, {
        withCredentials: true
    });

    return response?.data;
};

export const handlePaymentIntentAPI = async (payment) => {
    const response = await axios.post('https://gemai-server.onrender.com/api/payment-checkout', {
        amount: Number(payment?.amount),
        subscriptionPlan: payment?.plan
    }, {
        withCredentials: true
    });

    return response?.data;
};

export const verifyPaymentAPI = async (paymentId) => {
    const response = await axios.post(`https://gemai-server.onrender.com/api/verify-payment/${paymentId}`, {}, {
        withCredentials: true
    });

    return response?.data;
};