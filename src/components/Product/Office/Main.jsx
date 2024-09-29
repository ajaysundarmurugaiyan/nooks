import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../../firebase'; // Ensure 'db' is correctly imported

const Spinner = () => (
  <div className="flex justify-center items-center h-screen">
    <div className="w-16 h-16 border-4 border-t-transparent border-blue-500 border-solid rounded-full animate-spin"></div>
  </div>
);

function OfficeProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedProduct, setExpandedProduct] = useState(null); // Track which product's details are expanded
  const [extraImages, setExtraImages] = useState({}); // Store additional images for each product

  useEffect(() => {
    const fetchOfficeProducts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'officeProducts')); // Ensure the correct collection path
        const productsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProducts(productsData);
      } catch (err) {
        console.error('Error fetching office products:', err);
        setError('Failed to fetch products.');
      } finally {
        setLoading(false);
      }
    };

    fetchOfficeProducts();
  }, []);

  // Fetch additional images for the specific product
  const fetchMoreImages = async (productId) => {
    try {
      const imagesCollection = collection(db, `officeProducts/${productId}/images`);
      const imagesSnapshot = await getDocs(imagesCollection);
      const imageList = imagesSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setExtraImages((prev) => ({ ...prev, [productId]: imageList }));
      setExpandedProduct(productId); // Mark this product as expanded
    } catch (err) {
      console.error('Error fetching more images:', err);
      setError('Failed to fetch more images.');
    }
  };

  if (loading) return <Spinner />;
  if (error)
    return (
      <div className="flex h-[80vh] justify-center items-center ">
        <div className="text-4xl">{error}</div>
      </div>
    );

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-xl lg:text-3xl font-bold mb-6 text-center text-gray-600">
        Office Products
      </h1>
      <p className="my-3 mb-5 text-lg text-gray-500 max-w-5xl mx-auto text-center">
        Discover our stylish and ergonomic office furniture, perfect for creating a productive
        and comfortable workspace.
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
            <p className="text-gray-600">{product.description}</p>

            {/* "View More" Button */}
            {!expandedProduct || expandedProduct !== product.id ? (
              <a href={`/office-products/${product.id}`}>
              <button
                className="text-blue-500 hover:underline"
                onClick={() => fetchMoreImages(product.id)}
              >
                
                View More
              </button>
              </a>
            ) : (
              <div className="mt-4">
                <h4 className="text-lg font-semibold">Additional Images</h4>
                <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {extraImages[product.id] ? (
                    extraImages[product.id].map((image) => (
                      <div key={image.id} className="w-full h-48 bg-gray-100 flex items-center justify-center">
                        <img
                          src={image.imageUrl}
                          alt={image.name}
                          className="max-w-full max-h-full rounded-lg"
                        />
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500">No additional images available</p>
                  )}
                </div>

                {/* "View Less" Button */}
                <button
                  className="text-blue-500 hover:underline mt-4"
                  onClick={() => setExpandedProduct(null)}
                >
                  View Less
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default OfficeProducts;
