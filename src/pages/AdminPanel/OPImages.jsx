import React, { useEffect, useState } from 'react';
import { db, storage } from '../../firebase'; // Adjust the import based on your project structure
import { collection, getDocs, doc, setDoc, deleteDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const OPImages = () => {
  const [products, setProducts] = useState([]); // For product names
  const [categories, setCategories] = useState([]); // For category names
  const [selectedProduct, setSelectedProduct] = useState(""); // Selected product name
  const [selectedCategory, setSelectedCategory] = useState(""); // Selected category name
  const [imageText, setImageText] = useState(""); // Text for the image
  const [imageFile, setImageFile] = useState(null); // File to be uploaded
  const [uploadedImages, setUploadedImages] = useState([]); // Images uploaded to the selected category
  const [isSubmitting, setIsSubmitting] = useState(false); // Loading state

  // Fetch product names
  const fetchProducts = async () => {
    const productCollection = collection(db, 'officeProducts');
    const productSnapshot = await getDocs(productCollection);
    const productList = productSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    setProducts(productList);
  };

  // Fetch categories for the selected product
  const fetchCategories = async (productId) => {
    const categoryCollection = collection(db, `officeProducts/${productId}/images/${selectedCategory}`);
    const categorySnapshot = await getDocs(categoryCollection);
    const categoryList = categorySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    setCategories(categoryList);
  };

  // Fetch uploaded images for the selected category
  const fetchUploadedImages = async (categoryId) => {
    // const imagesCollection = collection(db, `officeProducts/${selectedProduct}/categories/${categoryId}/images`);
    const imagesCollection = collection(db, `officeProducts/${selectedProduct}/images/${categoryId}/categories`);
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
      fetchCategories(selectedProduct);
      setUploadedImages([]); // Clear images when product changes
    }
  }, [selectedProduct]);

  useEffect(() => {
    if (selectedCategory) {
      fetchUploadedImages(selectedCategory);
    }
  }, [selectedCategory]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
  };

  const handleSubmit = async () => {
    if (!selectedProduct || !selectedCategory || !imageFile || !imageText) {
      alert("Please fill all fields.");
      return;
    }

    setIsSubmitting(true);

    try {
      // Upload the image to Firebase Storage
      const imageRef = ref(storage, `office/${imageFile.name}`);
      await uploadBytes(imageRef, imageFile);
      const imageUrl = await getDownloadURL(imageRef);

      // Store image details in Firestore under the selected product and category
      const imageDocRef = doc(collection(db, `officeProducts/${selectedProduct}/images/${selectedCategory}/categories`));
      await setDoc(imageDocRef, {
        imageUrl,
        imageText,
        timestamp: new Date() // Optional: add a timestamp
      });

      alert("Image uploaded successfully!");
      setImageText("");
      setImageFile(null);
      fetchUploadedImages(selectedCategory); // Refresh the uploaded images list
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Error: " + error.message);
    }

    setIsSubmitting(false);
  };

  const handleDelete = async (imageId) => {
    if (window.confirm("Are you sure you want to delete this image?")) {
      try {
        await deleteDoc(doc(db, `officeProducts/${selectedProduct}/categories/${selectedCategory}/images`, imageId));
        alert("Image deleted successfully!");
        fetchUploadedImages(selectedCategory); // Refresh the uploaded images list
      } catch (error) {
        console.error("Error deleting image:", error);
        alert("Error: " + error.message);
      }
    }
  };
  console.log(categories)

  return (
    <div className='min-h-screen bg-gray-100 flex flex-col items-center pt-10'>
      <h1 className="text-4xl font-extrabold text-gray-800 mb-10">Admin Panel</h1>
      <div className='container max-w-4xl bg-white p-8 rounded-lg shadow-lg'>
        <h1 className="md:text-4xl text-2xl font-extrabold text-gray-800 mb-10">Office Product Images</h1>

        <div className='flex flex-col space-y-6'>
          <select
            value={selectedProduct}
            onChange={(e) => setSelectedProduct(e.target.value)}
            className="p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="" disabled>Select a product</option>
            {products.map(product => (
              <option key={product.id} value={product.id}>{product.name}</option> // Display the product name
            ))}
          </select>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={!selectedProduct} // Disable until a product is selected
          >
            <option value="" disabled>Select the type</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>{category.categoryName}</option> // Display the category name
            ))}
          </select>

          <input
            type="text"
            value={imageText}
            onChange={(e) => setImageText(e.target.value)}
            placeholder="Image Text"
            className="p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            type="file"
            accept="image/*"
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
          <div className='grid md:grid-cols-2 lg:grid-cols-3 grid-cols-1 gap-4'>
            {uploadedImages.length > 0 ? (
              uploadedImages.map((image) => (
                <div key={image.id} className="flex flex-col items-center mb-4 border p-2">
                  {/* <div className="font-semibold mb-1">{image.imageText}</div> */}
                  <img src={image.imageUrl} alt={image.imageText} className="w-32 h-32 object-cover" />
                  <div>
                  <button
                    onClick={() => handleDelete(image.id)}
                    className=" bg-red-600 text-white p-2 rounded-lg mt-2"
                  >
                    Delete
                  </button>
                  </div>
                </div>
              ))
            ) : (
              <p>No images uploaded yet.</p>
            )}
          </div>
        </div>

        <div className='mt-10 space-x-3 flex justify-center md:justify-start'>
          <a href="/office-product"><button className='px-5 py-1 border rounded-lg bg-blue-500'>Back</button></a>
          <a href="/admin"><button className='px-5 py-1 border rounded-lg bg-blue-500'>Submit</button></a>
        </div>
      </div>
    </div>
  );
};

export default OPImages;
