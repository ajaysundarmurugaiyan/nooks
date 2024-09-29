import React, { useState, useEffect } from "react";
import { db, storage, collection, addDoc, getDocs, doc, updateDoc, deleteDoc, ref, uploadBytes, getDownloadURL, deleteObject } from "../../firebase";

const OfficeCategory = () => {
  const [productName, setProductName] = useState("");
  const [productImage, setProductImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [products, setProducts] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [editProductId, setEditProductId] = useState(null);
  const [oldImageUrl, setOldImageUrl] = useState("");

  // Fetch products from Firestore
  const fetchProducts = async () => {
    const productCollection = collection(db, "officeProducts");
    const productSnapshot = await getDocs(productCollection);
    const productList = productSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    setProducts(productList);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleImageUpload = (e) => {
    setProductImage(e.target.files[0]); // Get the selected image file
  };

  const handleSubmit = async () => {
    if (!productName || !productImage) {
      alert("Please fill all fields.");
      return;
    }

    setIsSubmitting(true);

    try {
      // Upload image to Firebase Storage
      const imageRef = ref(storage, `office/${productImage.name}`); // Create a reference for the file
      await uploadBytes(imageRef, productImage); // Upload the image

      // Get the download URL of the uploaded image
      const imageUrl = await getDownloadURL(imageRef);

      if (editMode) {
        // Update the existing product
        const productRef = doc(db, "officeProducts", editProductId);
        await updateDoc(productRef, {
          name: productName,
          imageUrl: imageUrl,
        });
      } else {
        // Save new product details to Firestore
        await addDoc(collection(db, "officeProducts"), {
          name: productName,
          imageUrl: imageUrl,
        });
      }

      alert("Product added/updated successfully!");

      // Clear the form
      setProductName("");
      setProductImage(null);
      setEditMode(false);
      setEditProductId(null);
      fetchProducts(); // Refresh the product list
    } catch (error) {
      console.error("Error adding/updating product:", error);
      alert("Error: " + error.message);
    }

    setIsSubmitting(false);
  };

  const handleEdit = (product) => {
    setProductName(product.name);
    setOldImageUrl(product.imageUrl);
    setEditProductId(product.id);
    setEditMode(true);
  };

  const handleDelete = async (productId, imageUrl) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this product?");
    if (!confirmDelete) return;

    try {
      // Delete image from Firebase Storage
      const imageRef = ref(storage, imageUrl);
      await deleteObject(imageRef);

      // Delete product from Firestore
      const productRef = doc(db, "officeProducts", productId);
      await deleteDoc(productRef);

      alert("Product deleted successfully!");
      fetchProducts(); // Refresh the product list
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Error: " + error.message);
    }
  };

  return (
    <div className='container max-w-4xl bg-white p-8 rounded-lg shadow-lg'>
      <h1 className="md:text-4xl text-2xl font-extrabold text-gray-800 mb-10">Office Category</h1>
      <div className="flex flex-col space-y-10">
        <input
          type="text"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          placeholder="Product Name"
          className="p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload} // Handle image upload
          className="p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleSubmit} // Submit form
          className={`bg-blue-600 text-white p-3 rounded-lg flex items-center justify-center shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            isSubmitting ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={isSubmitting} // Disable button while submitting
        >
          {isSubmitting ? "Submitting..." : editMode ? "Update" : "Submit"}
        </button>
      </div>

      {/* Display uploaded products */}
      {/* <div className="mt-10">
        {products.map((product) => (
          <div key={product.id} className="flex items-center space-x-4 mb-4">
            <img src={product.imageUrl} alt={product.name} className="w-32 h-32 object-cover" />
            <div className="flex-1">
              <h2 className="font-bold">{product.name}</h2>
            </div>
            <button onClick={() => handleEdit(product)} className="bg-yellow-500 text-white px-4 py-2 rounded">Edit</button>
            <button onClick={() => handleDelete(product.id, product.imageUrl)} className="bg-red-600 text-white px-4 py-2 rounded">Delete</button>
          </div>
        ))}
      </div> */}
                <div className="items-center mt-10">
          <div className="grid items-center md:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((product) => (
              <div>
                <div
                  key={product.id}
                  className="flex flex-col items-center mb-4 border p-2"
                >
                  <div className="flex flex-col justify-center items-center">
                    <p className="font-bold">{product.name}</p>
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="object-cover w-32 h-32"
                    />
                  </div>
                  <div className="md:flex flex-row md:ml-3 space-x-5 my-3 justify-center">
                    <button
                      onClick={() => handleEdit(product)}
                      className="bg-yellow-500 text-white text-sm px-3 py-1 rounded-lg hover:bg-yellow-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(product)}
                      className="bg-red-600 text-white px-3 py-1 text-sm rounded-lg hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          </div>
    </div>
  );
};

export default OfficeCategory;
