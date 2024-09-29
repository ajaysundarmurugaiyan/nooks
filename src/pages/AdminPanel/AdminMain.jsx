import React, { useState } from 'react';
import InstitutionalCategory from './InstitutionalCategory';
import OfficeCategory from './OfficeCategory';

const AdminMain = () => {
  const [selectedCategory, setSelectedCategory] = useState('institutional'); // Set 'institutional' as default
  const [loading, setLoading] = useState(false); // Manage loading state

  // Function to handle category change
  const handleCategoryChange = (e) => {
    const value = e.target.value;
    setLoading(true); // Start loading
    setSelectedCategory(''); // Hide current category during loading

    setTimeout(() => {
      setSelectedCategory(value); // Display selected category after 1 second
      setLoading(false); // Stop loading
    }, 1000); // Simulate 1-second loading time
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center pt-10">
      <h1 className="text-4xl font-extrabold text-gray-800 mb-10">Admin Panel</h1>

      {/* Select for choosing category */}
      <select
        className="p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        onChange={handleCategoryChange}
        value={selectedCategory === '' ? '' : selectedCategory} // Keep selection consistent with the state
      >
        <option value="" disabled>
          Select
        </option>
        <option value="institutional">Institutional Category</option>
        <option value="office">Office Category</option>
      </select>

      {/* Loading message */}
      {loading && (
        <div className="text-blue-500 font-bold mt-6">
          Loading...
        </div>
      )}

      {/* Display InstitutionalCategory by default or if selected */}
      {selectedCategory === 'institutional' && !loading && (
        <div className="container max-w-4xl bg-white p-8 rounded-lg shadow-lg mt-10">
          <InstitutionalCategory />
          <div className="mt-10">
            <a href="/institutional-product">
              <button className="px-5 py-1 border rounded-lg bg-blue-600 hover:bg-blue-700 text-white">Next</button>
            </a>
          </div>
        </div>
      )}

      {/* Display OfficeCategory if selected */}
      {selectedCategory === 'office' && !loading && (
        <div className="container max-w-4xl bg-white p-8 rounded-lg shadow-lg mt-10">
          <OfficeCategory />
          <div className="mt-10">
            <a href="/office-product">
              <button className="px-5 py-1 border rounded-lg bg-blue-600 hover:bg-blue-700 text-white">Next</button>
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminMain;
