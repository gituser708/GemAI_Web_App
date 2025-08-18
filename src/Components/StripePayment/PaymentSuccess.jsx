import React from "react";
import { Link, useSearchParams } from "react-router-dom";
import { FaCheckCircle, FaTimesCircle, FaSpinner } from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";
import { verifyPaymentAPI } from "../../API/payment/paymentAPI";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const paymentIntentID = searchParams.get("payment_intent");

  const { data, isLoading, isError, error, isSuccess } = useQuery({
    queryFn: () => verifyPaymentAPI(paymentIntentID),
    queryKey: ["verify-payment", paymentIntentID],
    enabled: !!paymentIntentID,
  });

  return (
    <div className="max-w-lg mx-auto my-10 p-6 bg-white shadow-md rounded-lg">
      {isLoading ? (
        <div className="flex flex-col items-center justify-center">
          <FaSpinner className="animate-spin text-4xl text-blue-500 mb-3" />
          <p className="text-lg text-gray-600">
            Verifying your payment, please wait...
          </p>
        </div>
      ) : isError ? (
        <div className="text-center text-red-500">
          <FaTimesCircle className="text-5xl mb-3" />
          <p className="text-xl font-semibold">Payment verification failed</p>
          <p>{error?.response?.data?.message || "An error occurred"}</p>
        </div>
      ) : isSuccess && data?.status === "succeeded" ? (
        <div className="text-center text-green-500">
          <FaCheckCircle className="text-5xl mb-3" />
          <h1 className="text-2xl font-bold mb-3">Payment Successful</h1>
          <p className="text-gray-600 mb-4">
            Thank you for your payment. Your transaction ID is{" "}
            <span className="font-mono text-sm">{paymentIntentID}</span>.
          </p>
          <Link
            to="/generate-content"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Start Using Our GemAI
          </Link>
        </div>
      ) : (
        <div className="text-center text-yellow-500">
          <FaTimesCircle className="text-5xl mb-3" />
          <p className="text-xl font-semibold">Payment not completed</p>
          <p>Please try again or contact support.</p>
        </div>
      )}
    </div>
  );
};

export default PaymentSuccess;
