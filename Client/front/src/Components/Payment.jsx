import React, { useState } from 'react';
import Navbar from './Navbar';
import { useParams } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import pay from '../Images/pay.png';

export default function Payment() {
  const { id } = useParams();

  // Get today's date in YYYY-MM-DD format
  const getCurrentDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const [formData, setFormData] = useState({
    name: '',
    cardNumber: '',
    exp: '',
    cvv: '',
    amount: 100, // Set default amount to 100
    date: getCurrentDate(),  // Automatically set to the current date
    user: id    
  });

  const [isPaymentSuccessful, setIsPaymentSuccessful] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8000/payment/addpayment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      if (response.ok) {
        setIsPaymentSuccessful(true);
        setFormData({
          name: '',
          cardNumber: '',
          exp: '',
          cvv: '',
          amount: 100,
          date: getCurrentDate(),  // Reset to current date
          user: id
        });
      } else {
        toast.error(`Error: ${data.message}`);
      }
    } catch (error) {
      toast.error(`Error: ${error.message}`);
    }
  };

  return (
    <>
      <Navbar />
      <ToastContainer />
      <section className="bg-gray-100 relative top-4 antialiased dark:bg-gray-900 md:py-16">
        <div className="mx-auto max-w-screen-xl px-4 2xl:px-0">
          <div className="mx-auto max-w-5xl">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl pb-2">Payment</h2>

            <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8">
              
              <img 
                src={pay} 
                alt="Payment Illustration" 
                className="w-full lg:w-1/2 mb-6 lg:mb-0 lg:mr-8"
              />

              <form onSubmit={handleSubmit} className="w-full lg:w-1/2 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800 sm:p-6 lg:max-w-xl lg:p-8">
                <div className="mb-6 grid grid-cols-2 gap-4">
                  <div className="col-span-2 sm:col-span-1">
                    <label htmlFor="name" className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">Full name (as displayed on card)*</label>
                    <input type="text" id="name" value={formData.name} onChange={handleChange} className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500" placeholder="Bonnie Green" required />
                  </div>

                  <div className="col-span-2 sm:col-span-1">
                    <label htmlFor="cardNumber" className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">Card number*</label>
                    <input type="text" id="cardNumber" value={formData.cardNumber} onChange={handleChange} className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 pe-10 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500" placeholder="xxxx-xxxx-xxxx-xxxx" required />
                  </div>

                  <div>
                    <label htmlFor="exp" className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">Card expiration*</label>
                    <input type="text" id="exp" value={formData.exp} onChange={handleChange} className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500" placeholder="12/23" required />
                  </div>

                  <div>
                    <label htmlFor="cvv" className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">CVV*</label>
                    <input type="number" id="cvv" value={formData.cvv} onChange={handleChange} className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500" placeholder="•••" required />
                  </div>

                  <div className="col-span-2">
                    <label htmlFor="amount" className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">Amount*</label>
                    <input type="number" value={formData.amount} disabled id="amount" className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500" required />
                  </div>

                  <div className="col-span-2">
                    <label htmlFor="date" className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">Date*</label>
                    <input type="date" value={formData.date} disabled id="date" className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500" required />
                  </div>

                </div>

                <button type="submit" className="bg-blue-500 text-white w-full py-2 font-semibold shadow-xl rounded-lg">Pay now</button>
              </form>
             
            </div>
          </div>
        </div>
      </section>

      {/* Success Modal */}
      {isPaymentSuccessful && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold text-gray-900">Payment Successful</h2>
            <button 
              onClick={() => setIsPaymentSuccessful(false)} 
              className="mt-4 px-4 py-2 bg-green-500 text-white rounded-lg">
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}
