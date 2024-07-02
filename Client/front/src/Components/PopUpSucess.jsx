import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';  

export default function PopUpSucess() {
  const { activationCode } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const verifyActivationCode = async () => {
      try {
        const response = await fetch(`http://localhost:8000/authentification/verified/${activationCode}`, {
          method: 'POST',
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const result = await response.json();
        if (result.message) {
          toast.success(result.message);  // Show success message
        }

        
      } catch (error) {
        console.error('Error during email verification:', error);
        toast.error('An error occurred while verifying your email');  // Show generic error message
      }
    };

    verifyActivationCode();
  }, [activationCode, navigate]);

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="p-4 rounded shadow-lg bg-gradient-to-r from-purple-500 via-green-500 to-blue-500">
        <div className="flex flex-col items-center p-6 space-y-4 bg-white rounded-lg shadow-lg">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="text-green-600 w-24 h-24"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500">
            Thank You!
          </h1>
          <p className="text-lg">
            Your email has been successfully verified. You can now log in to your account.
          </p>
          <button
            onClick={() => navigate("/login")}  // Navigate to the login page
            className="inline-flex items-center px-4 py-2 text-white bg-indigo-600 border border-indigo-600 rounded-full hover:bg-indigo-700 focus:outline-none focus:ring"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M7 16l-4-4m0 0l4-4m-4 4h18"
              />
            </svg>
            <span className="text-sm font-medium">Login</span>
          </button>
        </div>
      </div>
    </div>
  );
}
