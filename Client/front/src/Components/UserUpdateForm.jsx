import React, { useState, useEffect } from 'react';

const UserUpdateForm = ({ user, onClose, onUpdate }) => {
    console.log(user._id)
    const [formData, setFormData] = useState({
        username: '',
        phone: '',
        email: ''
      });
    
      useEffect(() => {
        if (user) {
          setFormData({
            username: user.username || '',
            phone: user.phone || '',
            email: user.email || ''
          });
        }
      }, [user]);
    
      const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
          ...formData,
          [name]: value
        });
      };
    
      const handleSubmit = async (e) => {
        e.preventDefault();
        try {
          const response = await fetch(`http://localhost:8000/authentification/updateUser2/${user._id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
          });
    
          if (!response.ok) throw new Error('Failed to update user');
    
          const updatedUser = await response.json();
          onUpdate(updatedUser);  // Notify parent to update the user list
          onClose();  // Close the form
        } catch (err) {
          console.error('Error updating user:', err.message);
          alert('Error updating user');
        }
      };

  return (
    <div className="fixed inset-0 bg-gray-700 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Update User</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Phone</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
              required
            />
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-500 text-white rounded mr-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded"
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserUpdateForm;
