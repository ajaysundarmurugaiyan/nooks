// // CategoryImages.jsx

// import { useParams } from "react-router-dom";
// import { useEffect, useState } from "react";
// import { collection, getDocs } from "firebase/firestore";
// import { db } from "../firebase";

// const Spinner = () => (
//   <div className="flex justify-center items-center h-screen">
//     <div className="w-16 h-16 border-4 border-t-transparent border-blue-500 border-solid rounded-full animate-spin"></div>
//   </div>
// );

// function CategoryImages() {
//   const { name } = useParams(); // Get the category name from params
//   const [images, setImages] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchImages = async () => {
//       try {
//         const imagesCollectionRef = collection(db, "institutionalProducts", name, "images");
//         const imagesSnapshot = await getDocs(imagesCollectionRef);

//         if (!imagesSnapshot.empty) {
//           const imagesArray = imagesSnapshot.docs.map((doc) => ({
//             id: doc.id,
//             ...doc.data(), // Get image data
//           }));
//           setImages(imagesArray);
//         } else {
//           setError("No images found for this category.");
//         }
//       } catch (err) {
//         console.error("Error fetching images:", err);
//         setError("Failed to fetch images.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchImages();
//   }, [name]);

//   if (loading) return <Spinner />;
//   if (error) return <div className="text-center text-red-500">{error}</div>;

//   return (
//     <div className="container mx-auto p-4">
//       <h1 className="text-xl lg:text-3xl font-bold mb-6 text-center text-gray-600">
//         Images for {name}
//       </h1>
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//         {images.map((image) => (
//           <div key={image.id} className="relative border border-gray-300 rounded-lg p-4">
//             <img src={image.imageUrl}
//              alt={`Image ${image.id}`}
//               className="w-full h-48 object-cover rounded-md mb-2" />
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// export default CategoryImages;

import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { FaArrowLeft } from "react-icons/fa";

const Spinner = () => (
  <div className="flex justify-center items-center h-screen">
    <div className="w-16 h-16 border-4 border-t-transparent border-blue-500 border-solid rounded-full animate-spin"></div>
  </div>
);

function CategoryImages() {
  const { name, id } = useParams();

  const [categoryImages, setCategoryImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  console.log(categoryImages);
  useEffect(() => {
    const fetchCategoryImages = async () => {
      setLoading(true);
      setError(null);

      try {
        const categoriesCollectionRef = collection(
          db,
          "institutionalProducts",
          name,
          "images",
          id,
          "categories"
        );
        const categoriesSnapshot = await getDocs(categoriesCollectionRef);

        if (!categoriesSnapshot.empty) {
          const categoryImagesArray = categoriesSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setCategoryImages(categoryImagesArray);
        } else {
          setError("No images available.");
        }
      } catch (err) {
        console.error("Error fetching images from categories:", err);
        setError("Failed to fetch images.");
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryImages();
  }, [name, id]);

  if (loading) return <Spinner />;
  if (error) return <div className="text-center text-red-500">{error}</div>;

  const handleBackClick = () => {
    navigate(-1);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-start items-center">
        <a href="/institutional">
          <button
            // onClick={handleBackClick}
            className="mr-4 py-2 px-4 lg:px-6 bg-gray-500 text-white rounded-lg hover:bg-gray-800 flex items-center"
          >
            <FaArrowLeft className="mr-2" />
            Back
          </button>
        </a>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-5">
        {categoryImages.length > 0 ? (
          categoryImages.map((image) => (
            <div
              key={image.id}
              className="relative border border-gray-300 rounded-lg p-4"
            >
              <span className="absolute top-2 left-2 bg-green-400 text-white text-xs font-bold px-2 py-1 rounded">
                For sale
              </span>
              <div className="w-full h-48 mb-4 flex items-center justify-center">
                <img
                  src={image.imageUrl}
                  alt={`Image ${image.id}`}
                  className="max-w-full max-h-full rounded-lg"
                />
              </div>
              {/* <h2>{image.imageText}</h2> */}
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 w-full">
            No images available for this category.
          </p>
        )}
      </div>
    </div>
  );
}

export default CategoryImages;
