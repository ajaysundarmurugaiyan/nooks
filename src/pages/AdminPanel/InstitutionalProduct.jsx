import React, { useEffect, useState } from 'react';
import { db, storage, collection, getDocs, doc, setDoc, deleteDoc, ref, uploadBytes, getDownloadURL } from '../../firebase';

const InstitutionalProduct = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [categoryName, setCategoryName] = useState("");
  const [productImages, setProductImages] = useState([]);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingImageId, setEditingImageId] = useState(null); // To track which image is being edited

  const fetchProducts = async () => {
    const productCollection = collection(db, 'institutionalProducts');
    const productSnapshot = await getDocs(productCollection);
    const productList = productSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    setProducts(productList);
  };

  const fetchImages = async (productId) => {
    const imagesCollection = collection(db, 'institutionalProducts', productId, 'images');
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
    setIsSubmitting(true);

    try {
      const productDocRef = doc(db, 'institutionalProducts', selectedProduct.id);
      const imagesCollectionRef = collection(productDocRef, 'images');

      if (editingImageId) {
        // Update category name for the edited image
        const imageDocRef = doc(db, 'institutionalProducts', selectedProduct.id, 'images', editingImageId);
        await setDoc(imageDocRef, { categoryName }, { merge: true });
        alert("Category name updated successfully!");
        setEditingImageId(null); // Reset editing state
      } else {
        // Upload new images
        if (!categoryName || productImages.length === 0) {
          alert("Please fill all fields.");
          return;
        }

        for (const image of productImages) {
          const imageRef = ref(storage, `institutional/${image.name}`);
          await uploadBytes(imageRef, image);
          const imageUrl = await getDownloadURL(imageRef);
          const newImageDocRef = doc(imagesCollectionRef);
          await setDoc(newImageDocRef, {
            imageUrl,
            categoryName
          });
        }
        alert("Images uploaded successfully!");
      }

      // Reset form fields
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
    if (!selectedProduct) {
      alert("No product selected.");
      return;
    }

    if (window.confirm("Are you sure you want to delete this image?")) {
      try {
        const imageDocRef = doc(db, 'institutionalProducts', selectedProduct.id, 'images', imageId);
        await deleteDoc(imageDocRef);
        setUploadedImages((prevImages) => prevImages.filter((image) => image.id !== imageId));
        alert("Image deleted successfully!");
      } catch (error) {
        console.error("Error deleting image:", error);
        alert("Error: " + error.message);
      }
    }
  };

  const handleEditImage = (image) => {
    setEditingImageId(image.id);
    setCategoryName(image.categoryName); // Populate the input with the current category name
  };

  return (
    <div className='min-h-screen bg-gray-100 flex flex-col items-center pt-10'>
      <h1 className="text-4xl font-extrabold text-gray-800 mb-10">Admin Panel</h1>
      <div className='container max-w-4xl bg-white p-8 rounded-lg shadow-lg'>
        <h1 className="md:text-4xl text-2xl font-extrabold text-gray-800 mb-10">Institutional Products</h1>

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
            placeholder="Product Name"
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
            {isSubmitting ? "Submitting..." : (editingImageId ? "Update" : "Submit")}
          </button>
        </div>

        <div className="mt-10">
          <h2 className="text-xl font-bold mb-4">Uploaded Images:</h2>
          <div className='grid sm:grid-cols-2 lg:grid-cols-3 grid-cols-1'>
            {uploadedImages.length > 0 ? (
              uploadedImages.map((image, index) => (
                <div key={image.id} className="flex md:flex-row flex-col items-center mb-4 border p-2 w-fit">
                  <div className='flex md:flex-col items-center '>
                    <div className='items-center text-center'>
                      <div className="font-semibold mb-1">{image.categoryName}</div>
                      <img src={image.imageUrl} alt={`Uploaded ${index}`} className="object-cover" />
                    </div>
                  </div>
                  <div className='md:flex flex-col md:ml-3 md:space-x-0 space-y-2 justify-center'>
                    <button
                      onClick={() => handleEditImage(image)} // Open edit mode
                      className="bg-yellow-500 text-white p-2 rounded-lg mt-2">Edit</button>
                    <button
                      onClick={() => handleDeleteImage(image.id)}
                      className="bg-red-600 text-white p-2 rounded-lg mt-2 ml-2">Delete</button>
                  </div>
                </div>
              ))
            ) : (
              <p>No images uploaded yet.</p>
            )}
          </div>
        </div>

        <div className='mt-10 space-x-3 flex justify-center md:justify-start'>
          <a href="/admin"><button className='px-5 py-1 border rounded-lg bg-blue-500'>Previous</button></a>
          <a href="/ip-images"><button className='px-5 py-1 border rounded-lg bg-blue-500'>Next</button></a>
        </div>
      </div>
    </div>
  );
};

export default InstitutionalProduct;
