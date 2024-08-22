import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';  
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function ForgetPassword() {
  const [postData, setPostData] = useState({
    email: "",
  });
 
  // Declare forgetpw as an async function
  const forgetpw = async (e) => {
    e.preventDefault(); 
   
    try {
      const response = await fetch("http://localhost:8000/authentification/forgetpassword", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const result = await response.json();
      toast.success(result.message || 'Password reset instructions sent to your email');  
    //  navigate("/ResetPassword")
    } catch (error) {
      console.error('Error during password reset:', error);
      toast.error('An error occurred while resetting your password');  
    }
  };

  const handleInputChange = (e) => {
    setPostData({
      ...postData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <>
      <main id="content" role="main" className="w-full max-w-md mx-auto p-6 relative top-20">
        <div className="mt-7 bg-white rounded-xl shadow-lg dark:bg-gray-800 dark:border-gray-700 border-2 border-indigo-300">
          <div className="p-4 sm:p-7">
            <div className="text-center">
              <h1 className="block text-2xl font-bold text-gray-800 dark:text-white">Forgot password?</h1>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Remember your password?
                <a className="text-blue-600 decoration-2 hover:underline font-medium" href="/login">
                  Login here
                </a>
              </p>
            </div>

            <div className="mt-5">
              <form onSubmit={forgetpw}>
                <div className="grid gap-y-4">
                  <div>
                    <label htmlFor="email" className="block text-sm font-bold ml-1 mb-2 dark:text-white">Email address</label>
                    <div className="relative">
                      <input
                        onChange={handleInputChange}
                        type="email"
                        id="email"
                        name="email"
                        className="py-3 px-4 block w-full border-2 border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 shadow-sm"
                        required
                        aria-describedby="email-error"
                      />
                    </div>
                    <p className="hidden text-xs text-red-600 mt-2" id="email-error">Please include a valid email address so we can get back to you</p>
                  </div>
                  <button
                    type="submit"
                    className="py-3 px-4 inline-flex justify-center items-center gap-2 rounded-md border border-transparent font-semibold bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all text-sm dark:focus:ring-offset-gray-800"
                  >
                    Reset password
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

     
        <ToastContainer toastClassName="toastify-container" />

      </main>
    </>
  );
}
