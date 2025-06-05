import React from "react";
import { Outlet } from "react-router-dom";
import Navigation from "./Navigation"; // Assuming this is your header/navigation
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Layout = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 sm:p-6 lg:p-8">
      <ToastContainer
        position="top-right" // Position toasts more prominently
        autoClose={3000} // Auto-close after 3 seconds
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored" // Use colored themes for toasts
      />
      <div className="max-w-screen-md mx-auto bg-white rounded-xl shadow-2xl overflow-hidden mb-10 transform transition-all duration-300 ease-in-out hover:shadow-3xl">
        <Navigation /> {/* Your global navigation/header */}
        <main className="p-6 sm:p-8">
          <Outlet /> {/* Renders the current page content */}
        </main>
      </div>
    </div>
  );
};

export default Layout;