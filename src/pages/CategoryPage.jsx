import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../firebase"; // Your Firebase configuration
import { collection, getDocs } from "firebase/firestore";

const CategoryPage = () => {
  const { categoryId } = useParams(); // Get category ID from URL
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const imagesSnapshot = await getDocs(collection(db, `categories/${categoryId}/images`));
        const imagesData = imagesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setImages(imagesData);
      } catch (err) {
        console.error("Error fetching images:", err);
        setError("Failed to fetch images.");
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, [categoryId]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>Category Images</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {images.map(image => (
          <div key={image.id}>
            <img src={image.url} alt={image.altText} className="w-full h-auto" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryPage;
