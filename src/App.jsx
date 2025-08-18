import React from "react";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Registration from "./Components/Users/Register";
import Login from "./Components/Users/Login";
import Dashboard from './Components/Users/UserDashboard';
import PublicNavbar from "./Components/Navbar/PublicNavbar";
import PrivateNavbar from "./Components/Navbar/PrivateNavbar";
import Home from "./Components/Home/Home";
import FreeTrial from "./Components/Home/FreeTrial";
import AppFeatures from "./Components/AppFeatures/AppFeatures";
import Plans from './Components/Plans/Plan'
import About from './Components/About/AboutUs';
import { useAuth } from './AuthContext/AuthContext';
import AuthRoute from "./Components/AuthRoute/AuthRoute";
import AIAssistant from "./Components/ContentGeneration/GenerateContent";
import FreePlanSignup from "./Components/StripePayment/FreePlanSignup";
import CheckoutForm from "./Components/StripePayment/CheckoutForm";
import PaymentSuccess from "./Components/StripePayment/PaymentSuccess";
import ContentGenerationHistory from "./Components/Users/ContentGenerationHistory";


export default function App() {
  const { isAuthenticated } = useAuth();
  return (
    <React.Fragment>
      <BrowserRouter>
        {isAuthenticated ? <PrivateNavbar /> : <PublicNavbar />}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/trial" element={<FreeTrial />} />
          <Route path="/features" element={<AppFeatures />} />
          <Route path="/plans" element={<Plans />} />
          <Route path="/about" element={<About />} />
          <Route path="/register" element={<Registration />} />
          <Route path="/login" element={<Login />} />
  
          <Route path="/dashboard" element={
            <AuthRoute>
              <Dashboard />
            </AuthRoute>
          } />

          <Route path="/generate-content" element={
            <AuthRoute>
              <AIAssistant />
            </AuthRoute>
          } />

          <Route path="/free-plan" element={
            <AuthRoute>
              <FreePlanSignup />
            </AuthRoute>
          } />

          <Route path="/checkout/:plan" element={
            <AuthRoute>
              <CheckoutForm />
            </AuthRoute>
          } />

          <Route path="/payment-success" element={
            <AuthRoute>
              <PaymentSuccess />
            </AuthRoute>
           } />

          <Route path="/history" element={
            <AuthRoute>
              <ContentGenerationHistory />
            </AuthRoute>
          } />
          
        </Routes>
      </BrowserRouter>
    </React.Fragment>
  );
};