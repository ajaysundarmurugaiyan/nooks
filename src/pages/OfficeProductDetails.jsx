import { useParams, useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { FaArrowLeft } from "react-icons/fa";

const Spinner = () => (
  <div className="flex justify-center items-center h-screen">
    <div className="w-16 h-16 border-4 border-t-transparent border-blue-500 border-solid rounded-full animate-spin"></div>
  </div>
);

function OfficeProductDetails() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { name } = useParams(); // Use product ID (name) from the URL
  const [categoryName, setCategoryName] = useState(""); // Store the current category name

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // Fetching the list of office products
        const categoriesCollectionRef = collection(db, "officeProducts");
        const querySnapshot = await getDocs(categoriesCollectionRef);

        if (!querySnapshot.empty) {
          const categoriesArray = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setCategories(categoriesArray);
          // Set the category name based on the name from the params
          const currentCategory = categoriesArray.find(
            (category) => category.id === name
          );
          console.log(currentCategory)
          if (currentCategory) {
            setCategoryName(currentCategory.name); // Set category name
          }
        } else {
          setError("No office product categories found.");
        }
      } catch (err) {
        console.error("Error fetching office products:", err);
        setError("Failed to fetch categories.");
      } finally {
        setLoading(false);
      }
    };

    const fetchImages = async () => {
      try {
        // Fetching the images for the specific office product
        const imagesCollectionRef = collection(db, "officeProducts", name, "images");
        const imagesSnapshot = await getDocs(imagesCollectionRef);

        if (!imagesSnapshot.empty) {
          const imagesArray = imagesSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setImages(imagesArray);
        } else {
          setError("No images found for this office product.");
        }
      } catch (err) {
        console.error("Error fetching images:", err);
        setError("Failed to fetch images.");
      }
    };

    fetchCategories();
    fetchImages();
  }, [name]);

  const handleBackClick = () => {
    navigate(-1);
  };

  if (loading) return <Spinner />;
  if (error)
    return (
      <div className="flex h-[80vh] justify-center items-center">
        <a href="/office">
        <button
        //   onClick={handleBackClick}
          className="mr-4 py-2 px-4 lg:px-6 bg-gray-500 text-white rounded-lg hover:bg-gray-800 flex items-center"
        >
          <FaArrowLeft className="mr-2" />
          Back
        </button>
        </a>
        <div className="lg:text-4xl text-xl"> {error}</div>
      </div>
    );

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-start items-center">
      <a href="/office">
        <button
        //   onClick={handleBackClick}
          className="mr-4 py-2 px-4 lg:px-6 bg-gray-500 text-white rounded-lg hover:bg-gray-800 flex items-center"
        >
          <FaArrowLeft className="mr-2" />
          Back
        </button>
        </a>
      </div>
      <h1 className="text-xl lg:text-3xl font-bold mb-6 text-center text-gray-600">
        Office Products - {categoryName}
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-center">
        {images.length > 0 ? (
          images.map((image) => (
            <div
              key={image.id}
              className="relative border border-gray-300 rounded-lg p-4 shadow-sm"
            >
              <span className="absolute top-2 left-2 bg-green-400 text-white text-xs font-bold px-2 py-1 rounded">
                For sale
              </span>
              <div className="w-full h-48 mb-4 flex items-center justify-center">
                <img
                  src={image.imageUrl}
                  alt={`Uploaded ${image.id}`}
                  className="max-w-full max-h-full rounded-lg"
                />
              </div>
              {/* <h3 className="text-xl font-medium mb-2">{image.categoryName}</h3> */}
            </div>
          ))
        ) : (
          <p>No images uploaded for this office product yet.</p>
        )}
      </div>
    </div>
  );
}

export default OfficeProductDetails;
