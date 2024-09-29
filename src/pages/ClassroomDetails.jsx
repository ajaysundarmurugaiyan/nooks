// ClassroomDetails.jsx
import { useParams, useNavigate, Link } from "react-router-dom"; // Ensure Link is imported
import { useEffect, useState } from "react";
import { collection, getDocs, query, limit } from "firebase/firestore";
import { db } from "../firebase"; // Correct import path for your firebase.js file
import { FaArrowLeft } from "react-icons/fa";

const Spinner = () => (
  <div className="flex justify-center items-center h-screen">
    <div className="w-16 h-16 border-4 border-t-transparent border-blue-500 border-solid rounded-full animate-spin"></div>
  </div>
);

function ClassroomDetails() {
  const { category } = useParams(); // Category name from the URL parameters (e.g., "Classroom")
  const navigate = useNavigate();
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const itemsPerPage = 5; // Set the number of images to load per page

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const imagesCollectionRef = collection(db, "institutionalProducts", category, "Images");

        // Query to get images from the specified category
        const imagesQuery = query(imagesCollectionRef, limit(itemsPerPage));
        const querySnapshot = await getDocs(imagesQuery);

        if (!querySnapshot.empty) {
          const imagesArray = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

          // Log the fetched images to see their structure
          console.log(imagesArray); // Check the array of images in the console

          setImages(imagesArray);
        } else {
          setError("No images found for this category.");
        }
      } catch (err) {
        console.error("Error fetching images:", err);
        setError("Failed to fetch images.");
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, [category]);

  const handleBackClick = () => {
    navigate(-1);
  };

  if (loading) return <Spinner />;

  if (error)
    return (
      <div className="flex h-[80vh] justify-center items-center">
        <button
          onClick={handleBackClick}
          className="mr-4 py-2 px-4 lg:px-6 bg-gray-500 text-white rounded-lg hover:bg-gray-800 flex items-center"
        >
          <FaArrowLeft className="mr-2" />
          Back
        </button>
        <div className="lg:text-4xl text-xl">{error}</div>
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
        {category} Images
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-center">
        {images.length > 0 ? (
          images.map((image) => (
            <div
              key={image.id}
              className="relative border border-gray-300 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              {image.imageUrl ? (
                <div className="w-full h-48 mb-4 flex items-center justify-center">
                  <img
                    src={image.imageUrl} // This should point to the actual image URL
                    alt={image.name}
                    className="max-w-full max-h-full rounded-lg"
                  />
                </div>
              ) : (
                <div className="w-full h-48 mb-4 bg-gray-200 rounded-lg flex items-center justify-center text-center">
                  <p className="text-gray-500">No Image Available</p>
                </div>
              )}
              <h3 className="text-xl font-medium mb-2">{image.name}</h3>
              {/* View More Button */}
              <Link to={`/image/${image.id}`} className="mt-4 py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-700">
                View More
              </Link>
            </div>
          ))
        ) : (
          <p>No images found.</p>
        )}
      </div>
    </div>
  );
}

export default ClassroomDetails;
