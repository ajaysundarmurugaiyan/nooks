import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "./firebase"; // Ensure 'db' is correctly imported
import { FaArrowLeft } from "react-icons/fa";

const Spinner = () => (
  <div className="flex justify-center items-center h-screen">
    <div className="w-16 h-16 border-4 border-t-transparent border-blue-500 border-solid rounded-full animate-spin"></div>
  </div>
);
function InstitutionalProductDetails() {
  const { name } = useParams(); // Get the product name from the URL parameters
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        // Convert the dashed URL parameter to a name with spaces
        const categoryName = name.replace(/-/g, " ");
        // Reference to the Items collection under Rolling Chairs
        const itemsCollectionRef = collection(
          db,
          "officeCategory",
          name,
          "Items"
        );

        // Query to find the document with the specified name
        const q = query(itemsCollectionRef, where("name", "==", name));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          // Assuming name is unique, so we take the first matching document
          const docSnap = querySnapshot.docs[0];
          setProduct(docSnap.data());
        } else {
          setError("No such product found.");
        }
      } catch (err) {
        console.error("Error fetching product details:", err);
        setError("Failed to fetch product details.");
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [name]);

  const handleBackClick = () => {
    navigate(-1); // Navigate back to the previous page
  };

  if (loading) return <Spinner/>;
  if (error)
    return (
      <div className="flex h-[80vh] justify-center items-center ">
        <button
          onClick={handleBackClick}
          className="mr-4 py-2 px-4 lg:px-6 bg-green-500 text-white rounded-lg hover:bg-gray-800 flex items-center"
        >
          <FaArrowLeft className="mr-2" />
          Back
        </button>
        <div className="text-4xl"> {error}</div>
      </div>
    );

  return (
    <div className="container mx-auto p-4">
      <button
        onClick={handleBackClick}
        className="mb-4 py-2 px-4 lg:px-6 bg-gray-500 text-white rounded-lg hover:bg-gray-800 flex items-center"
      >
        <FaArrowLeft className="mr-2" />
        Back
      </button>
      <h1 className="text-xl lg:text-3xl font-bold mb-6 text-center text-gray-600">
        {name.replace(/-/g, " ")} Products
      </h1>
      <p className="my-3 text-lg text-gray-500 max-w-5xl mx-auto text-center">
      We provides top-quality, durable institutional furniture designed for comfort, functionality, and modern aesthetics, ensuring optimal learning environments.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-center">
        {product.length > 0 ? (
          product.map((product) => (
            <div
              key={product.id}
              className="relative border border-gray-300 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <span className="absolute top-2 left-2 bg-green-400 text-white text-xs font-bold px-2 py-1 rounded">
                For sale
              </span>
              {product.imageUrl ? (
                <div className="w-full h-48 mb-4 flex items-center justify-center">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="max-w-full max-h-full rounded-lg"
                  />
                </div>
              ) : (
                <div className="w-full h-48 mb-4 bg-gray-200 rounded-lg flex items-center justify-center text-center">
                  <p className="text-gray-500">No Image Available</p>
                </div>
              )}
              <h3 className="text-xl font-medium mb-2">{product.name}</h3>
            </div>
          ))
        ) : (
          <p>No products found.</p>
        )}
      </div>
    </div>
  );
}

export default InstitutionalProductDetails;
