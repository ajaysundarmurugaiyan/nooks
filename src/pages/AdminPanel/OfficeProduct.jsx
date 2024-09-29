import React, { useEffect, useState } from 'react';
import { db, storage, collection, getDocs, doc, setDoc, deleteDoc, ref, uploadBytes, getDownloadURL } from '../../firebase';

const OfficeProduct = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [categoryName, setCategoryName] = useState("");
  const [productImages, setProductImages] = useState([]);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch office products from the database
  const fetchProducts = async () => {
    const productCollection = collection(db, 'officeProducts');
    const productSnapshot = await getDocs(productCollection);
    const productList = productSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    setProducts(productList);
  };

  // Fetch images for the selected product
  const fetchImages = async (productId) => {
    const imagesCollection = collection(db, 'officeProducts', productId, 'images');
    const imagesSnapshot = await getDocs(imagesCollection);
    const imageList = imagesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    setUploadedImages(imageList);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (selectedProduct) {
      fetchImages(selectedProduct.id);
    } else {
      setUploadedImages([]);
    }
  }, [selectedProduct]);

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setProductImages((prevImages) => [...prevImages, ...files]);
  };

  const handleSubmit = async () => {
    if (!selectedProduct || !categoryName || productImages.length === 0) {
      alert("Please fill all fields.");
      return;
    }

    setIsSubmitting(true);

    try {
      const productDocRef = doc(db, 'officeProducts', selectedProduct.id);
      const imagesCollectionRef = collection(productDocRef, 'images');

      for (const image of productImages) {
        const imageRef = ref(storage, `office/${image.name}`);
        await uploadBytes(imageRef, image);
        const imageUrl = await getDownloadURL(imageRef);
        const newImageDocRef = doc(imagesCollectionRef);
        await setDoc(newImageDocRef, {
          imageUrl,
          categoryName
        });
      }

      alert("Images uploaded successfully!");
      setSelectedProduct(null);
      setCategoryName("");
      setProductImages([]);
      fetchImages(selectedProduct.id);
    } catch (error) {
      console.error("Error uploading images:", error);
      alert("Error: " + error.message);
    }

    setIsSubmitting(false);
  };

  const handleDeleteImage = async (imageId) => {
    if (window.confirm("Are you sure you want to delete this image?")) {
      try {
        const imageDocRef = doc(db, 'officeProducts', selectedProduct.id, 'images', imageId);
        await deleteDoc(imageDocRef);
        fetchImages(selectedProduct.id);
        alert("Image deleted successfully!");
      } catch (error) {
        console.error("Error deleting image:", error);
        alert("Error: " + error.message);
      }
    }
  };

  return (
    <div className='min-h-screen bg-gray-100 flex flex-col items-center pt-10'>
      <h1 className="text-4xl font-extrabold text-gray-800 mb-10">Admin Panel</h1>
      <div className='container max-w-4xl bg-white p-8 rounded-lg shadow-lg'>
        <h1 className="md:text-4xl text-2xl font-extrabold text-gray-800 mb-10">Office Products</h1>

        <div className='flex flex-col space-y-6'>
          <select
            value={selectedProduct ? JSON.stringify(selectedProduct) : ""}
            onChange={(e) => setSelectedProduct(JSON.parse(e.target.value))}
            className="p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="" disabled>Select a product</option>
            {products.map(product => (
              <option key={product.id} value={JSON.stringify(product)}>{product.name}</option>
            ))}
          </select>

          <input
            type="text"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            placeholder="Category Name"
            className="p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageUpload}
            className="p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            onClick={handleSubmit}
            className={`bg-blue-600 text-white p-3 rounded-lg flex items-center justify-center shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>
        </div>

        <div className="mt-10">
          <h2 className="text-xl font-bold mb-4">Uploaded Images:</h2>
          <div className='grid sm:grid-cols-2 lg:grid-cols-3 grid-cols-1 gap-4'>
            {uploadedImages.length > 0 ? (
              uploadedImages.map((image, index) => (
                <div key={image.id} className="flex flex-col items-center mb-4 border p-2">
                  <div className='flex flex-col items-center'>
                    {/* <div className="font-semibold mb-1">{image.categoryName}</div> */}
                    <img src={image.imageUrl} alt={`Uploaded ${index}`} className="w-32 h-32 object-cover" />
                  </div>
                  <div className='md:flex flex-row md:ml-3 space-x-5 space-y-2 justify-center'>
                  <button
                    onClick={() => handleDeleteImage(image.id)}
                    className="bg-red-600 text-white p-2 rounded-lg mt-2">Delete</button>
                    </div>
                </div>
              ))
            ) : (
              <p>No images uploaded yet.</p>
            )}
          </div>
        </div>

        <div className='mt-10 flex justify-center md:justify-start space-x-3'>
          <a href="/admin"><button className='px-5 py-1 border rounded-lg bg-blue-500'>Previous</button></a>
          <a href="/admin"><button className='px-5 py-1 border rounded-lg bg-blue-500'>Submit</button></a>
        </div>
      </div>
    </div>
  );
};

export default OfficeProduct;
