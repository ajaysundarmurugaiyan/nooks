// import { useEffect, useState } from "react";
// import { collection, getDocs } from "firebase/firestore";
// import { db } from "../../../firebase"; // Ensure 'db' is correctly imported
// import { Link } from "react-router-dom";

// const Spinner = () => (
//   <div className="flex justify-center items-center h-screen">
//     <div className="w-16 h-16 border-4 border-t-transparent border-blue-500 border-solid rounded-full animate-spin"></div>
//   </div>
// );
// function InstitutionalProducts() {
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchInstitutionalProducts = async () => {
//       try {
//         const querySnapshot = await getDocs(
//           collection(db, "institutionalProducts")
//         );
//         const productsData = querySnapshot.docs.map((doc) => ({
//           id: doc.id,
//           ...doc.data(),
//         }));

//         setProducts(productsData);
//       } catch (err) {
//         console.error("Error fetching institutional products:", err);
//         setError("Failed to fetch products.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchInstitutionalProducts();
//   }, []);
//   console.log(products)

//   if (loading) return <Spinner/>;
//   if (error)
//     return (
//       <div className="flex h-[80vh] justify-center items-center ">
//         <button
//           onClick={handleBackClick}
//           className="mr-4 py-2 px-4 lg:px-6 bg-green-500 text-white rounded-lg hover:bg-gray-800 flex items-center"
//         >
//           <FaArrowLeft className="mr-2" />
//           Back
//         </button>
//         <div className="lg:text-2xl text-xl "> {error}</div>
//       </div>
//     );

//   return (
//     <div className="container mx-auto p-4">
//       <h1 className="text-xl lg:text-3xl font-bold mb-6 text-center text-gray-600">
//         Institutional Products
//       </h1>
//       <p className="my-3 text-lg text-gray-500 max-w-5xl mx-auto text-center">
//         A wide range of single and double desks, writing pad chairs, and
//         teachers' tables to enhance the learning environment.
//       </p>
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-center">
//         {products.map((product) => (
//           <div
//             key={product.id}
//             className="relative border border-gray-300 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-300"
//           >
//             <span className="absolute top-2 left-2 bg-green-400 text-white text-xs font-bold px-2 py-1 rounded">
//               For sale
//             </span>
//             {product.imageUrl ? (
//               <div className="w-full h-48 mb-4 flex items-center justify-center">
//                 <img
//                   src={product.imageUrl}
//                   alt={product.name}
//                   className="max-w-full max-h-full rounded-lg"
//                 />
//               </div>
//             ) : (
//               <div className="w-full h-48 mb-4 bg-gray-200 rounded-lg flex items-center justify-center text-center">
//                 <p className="text-gray-500">No Image Available</p>
//               </div>
//             )}
//             <h3 className="text-xl font-medium mb-2">{product.name}</h3>
//             <Link
//               to={`/institutional-products/${product.name}`}
//               className="text-blue-500 hover:text-blue-700"
//             >
//               View More
//             </Link>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// export default InstitutionalProducts;


import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../firebase"; // Ensure 'db' is correctly imported
import { Link } from "react-router-dom";

const Spinner = () => (
  <div className="flex justify-center items-center h-screen">
    <div className="w-16 h-16 border-4 border-t-transparent border-blue-500 border-solid rounded-full animate-spin"></div>
  </div>
);
function InstitutionalProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
console.log(products)
  useEffect(() => {
    const fetchInstitutionalProducts = async () => {
      try {
        const querySnapshot = await getDocs(
          collection(db, "institutionalProducts")
        );
        const productsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setProducts(productsData);
      } catch (err) {
        console.error("Error fetching institutional products:", err);
        setError("Failed to fetch products.");
      } finally {
        setLoading(false);
      }
    };

    fetchInstitutionalProducts();
  }, []);
  console.log(products)

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
        <div className="lg:text-2xl text-xl "> {error}</div>
      </div>
    );

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-xl lg:text-3xl font-bold mb-6 text-center text-gray-600">
        Institutional Products
      </h1>
      <p className="my-3 text-lg text-gray-500 max-w-5xl mx-auto text-center">
        A wide range of single and double desks, writing pad chairs, and
        teachers' tables to enhance the learning environment.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-center">
        {products.map((product) => (
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
            <Link
              to={`/institutional-products/${product.id}`}
              className="text-blue-500 hover:text-blue-700"
            >
              View More
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default InstitutionalProducts;
