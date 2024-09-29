// import { useParams, useNavigate, Link } from "react-router-dom";
// import { useEffect, useState } from "react";
// import { collection, getDocs } from "firebase/firestore";
// import { db } from "./firebase";
// import { FaArrowLeft } from "react-icons/fa";

// const Spinner = () => (
//   <div className="flex justify-center items-center h-screen">
//     <div className="w-16 h-16 border-4 border-t-transparent border-blue-500 border-solid rounded-full animate-spin"></div>
//   </div>
// );

// function InstitutionalProductDetails() {
//   const navigate = useNavigate();
//   const [categories, setCategories] = useState([]);
//   const [images, setImages] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const { name } = useParams();
//   const [categoryName, setCategoryName] = useState(""); // New state for categoryName

//   useEffect(() => {
//     const fetchCategories = async () => {
//       try {
//         const categoriesCollectionRef = collection(db, "institutionalProducts");
//         const querySnapshot = await getDocs(categoriesCollectionRef);

//         if (!querySnapshot.empty) {
//           const categoriesArray = querySnapshot.docs.map((doc) => ({
//             id: doc.id,
//             name: doc.id,
//           }));
//           setCategories(categoriesArray);
//           // Set categoryName based on the name from params
//           const currentCategory = categoriesArray.find(
//             (category) => category.id === name
//           );
//           if (currentCategory) {
//             setCategoryName(currentCategory.name); // Set category name
//           }
//         } else {
//           setError("No categories found.");
//         }
//       } catch (err) {
//         console.error("Error fetching categories:", err);
//         setError("Failed to fetch categories.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     const fetchImages = async () => {
//       try {
//         const imagesCollectionRef = collection(
//           db,
//           "institutionalProducts",
//           name,
//           "images"
//         );
//         const imagesSnapshot = await getDocs(imagesCollectionRef);

//         if (!imagesSnapshot.empty) {
//           const imagesArray = imagesSnapshot.docs.map((doc) => ({
//             id: doc.id,
//             ...doc.data(),
//           }));
//           setImages(imagesArray);
//         } else {
//           setError("No images found for this category.");
//         }
//       } catch (err) {
//         console.error("Error fetching images:", err);
//         setError("Failed to fetch images.");
//       }
//     };

//     fetchCategories();
//     fetchImages();
//   }, [name]);


//   if (loading) return <Spinner />;
//   if (error)
//     return (
//       <div className="flex h-[80vh] justify-center items-center ">
//         <button
//           onClick={handleBackClick}
//           className="mr-4 py-2 px-4 lg:px-6 bg-gray-500 text-white rounded-lg hover:bg-gray-800 flex items-center"
//         >
//           <FaArrowLeft className="mr-2" />
//           Back
//         </button>
//         <div className="lg:text-4xl text-xl"> {error}</div>
//       </div>
//     );

//   return (
//     <div className="container mx-auto p-4">
//       <div className="flex justify-start items-center ">
//         <Link to={`/institutional`}>
//         <button
//           className="mr-4 py-2 px-4 lg:px-6 bg-gray-500 text-white rounded-lg hover:bg-gray-800 flex items-center"
//         >
//           <FaArrowLeft className="mr-2" />
//           Back
//         </button>
//         </Link>
//         <div className="lg:text-4xl text-xl"> {error}</div>
//       </div>
//       <h1 className="text-xl lg:text-3xl font-bold mb-6 text-center text-gray-600">
//         Institutional Products - {name}
//       </h1>
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-center">
//         {images.length > 0 ? (
//           images.map((image) => (
//             <div
//               key={image.id}
//               className="relative border border-gray-300 rounded-lg p-4 shadow-sm"
//             >
//               <span className="absolute top-2 left-2 bg-green-400 text-white text-xs font-bold px-2 py-1 rounded">
//                 For sale
//               </span>
//               <div className="w-full h-48 mb-4 flex items-center justify-center">
//               <img
//                 src={image.imageUrl}
//                 alt={`Uploaded ${image.id}`}
//                 className="max-w-full max-h-full rounded-lg"
//               />
//               </div>
//               <h3 className="text-xl font-medium mb-2">{image.categoryName}</h3>
//               <Link
//                 to={`/category-images/${image.categoryName}`}
//                 className="mt-4 py-2 px-4 text-blue-700"
//               >
//                 View More
//               </Link>
//             </div>
//           ))
//         ) : (
//           <p>No images uploaded for this category yet.</p>
//         )}
//       </div>
//     </div>
//   );
// }

// export default InstitutionalProductDetails;



import { useParams, useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebase";
import { FaArrowLeft } from "react-icons/fa";

const Spinner = () => (
  <div className="flex justify-center items-center h-screen">
    <div className="w-16 h-16 border-4 border-t-transparent border-blue-500 border-solid rounded-full animate-spin"></div>
  </div>
);

function InstitutionalProductDetails() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { name } = useParams();
  const [categoryName, setCategoryName] = useState(""); // New state for categoryName
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesCollectionRef = collection(db, "institutionalProducts");
        const querySnapshot = await getDocs(categoriesCollectionRef);

        if (!querySnapshot.empty) {
          const categoriesArray = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(), // Get all fields including `name` and `imageUrl`
          }));
          setCategories(categoriesArray);

          // Set categoryName based on the name from params
          const currentCategory = categoriesArray.find(
            (category) => category.id === name
          );
          if (currentCategory) {
            setCategoryName(currentCategory.name); // Set category name
          }
        } else {
          setError("No categories found.");
        }
      } catch (err) {
        console.error("Error fetching categories:", err);
        setError("Failed to fetch categories.");
      } finally {
        setLoading(false);
      }
    };

    const fetchImages = async () => {
      try {
        const imagesCollectionRef = collection(
          db,
          "institutionalProducts",
          name,
          "images"
        );
        const imagesSnapshot = await getDocs(imagesCollectionRef);

        if (!imagesSnapshot.empty) {
          const imagesArray = imagesSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setImages(imagesArray);
        } else {
          setError("No images found for this category.");
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
      <div className="flex h-[80vh] justify-center items-center ">
        <a href="/institutional">
        <button
          // onClick={handleBackClick}
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
      <div className="flex justify-start items-center ">
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
      {/* Updated the header to use categoryName */}
      <h1 className="text-xl lg:text-3xl font-bold mb-6 text-center text-gray-600">
        Institutional Products - {categoryName}
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
              <h3 className="text-xl font-medium mb-2">{image.categoryName}</h3>
              <Link
                to={`/category-images/${name}/${image.id}`} // Pass both name and image id in the URL
                className="mt-4 py-2 px-4 text-blue-700"
              >
                View More
              </Link>
            </div>
          ))
        ) : (
          <p>No images uploaded for this category yet.</p>
        )}
      </div>
    </div>
  );
}

export default InstitutionalProductDetails;
