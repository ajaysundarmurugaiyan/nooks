import { useEffect, useState } from "react";
import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";

const ProductImagesPage = ({ match }) => {
  const [images, setImages] = useState([]);
  const [showMore, setShowMore] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { productId } = match.params; // Get product ID from route params

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const docRef = doc(db, "institutionalProducts", productId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setImages(data.images || []); // Assuming images are stored in an array
        } else {
          setError("No such document!");
        }
      } catch (err) {
        setError("Failed to fetch images.");
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, [productId]);

  const handleViewMore = (index) => {
    setShowMore((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Product Images</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        {images.map((image, index) => (
          <div key={image.id} className="relative">
            <img src={image.url} alt={image.name} className="w-full h-auto rounded-lg" />
            {image.nestedImages && image.nestedImages.length > 0 && (
              <>
                <button
                  onClick={() => handleViewMore(index)}
                  className="absolute bottom-2 left-2 bg-white text-black px-2 py-1 rounded"
                >
                  {showMore[index] ? "View Less" : "View More"}
                </button>
                {showMore[index] && (
                  <div className="mt-2 grid grid-cols-1 gap-2">
                    {image.nestedImages.map((nestedImage) => (
                      <img
                        key={nestedImage.id}
                        src={nestedImage.url}
                        alt={nestedImage.name}
                        className="w-full h-auto rounded-lg"
                      />
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductImagesPage;
