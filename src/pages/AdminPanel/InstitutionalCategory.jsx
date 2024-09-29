import React, { useState, useEffect } from "react";
import {
  db,
  storage,
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "../../firebase";

const InstitutionalCategory = () => {
  const [productName, setProductName] = useState("");
  const [productImage, setProductImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [products, setProducts] = useState([]);
  const [editingProductId, setEditingProductId] = useState(null);
  const [oldImageUrl, setOldImageUrl] = useState(""); // Store old image URL for deletion

  // Fetch all products from Firestore
  const fetchProducts = async () => {
    const productsCollection = await getDocs(
      collection(db, "institutionalProducts")
    );
    const productsData = productsCollection.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));
    setProducts(productsData);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleImageUpload = (e) => {
    setProductImage(e.target.files[0]);
  };

  const handleSubmit = async () => {
    if (!productName || (!productImage && !editingProductId)) {
      alert("Please fill all fields.");
      return;
    }

    setIsSubmitting(true);

    try {
      let imageUrl = oldImageUrl; // Default to old image URL if no new image is uploaded

      // Check if there's a new image being uploaded
      if (productImage) {
        const imageRef = ref(storage, `products/${productImage.name}`);
        await uploadBytes(imageRef, productImage);
        imageUrl = await getDownloadURL(imageRef);

        // If editing, delete the old image from Firebase Storage
        if (editingProductId && oldImageUrl) {
          const oldImageRef = ref(storage, oldImageUrl);
          await deleteObject(oldImageRef);
        }
      }

      // If editing, update the product
      if (editingProductId) {
        const productRef = doc(db, "institutionalProducts", editingProductId);
        await updateDoc(productRef, {
          name: productName,
          imageUrl: imageUrl,
        });
        alert("Product updated successfully!");
      } else {
        // Save new product to Firestore
        await addDoc(collection(db, "institutionalProducts"), {
          name: productName,
          imageUrl: imageUrl,
        });
        alert("Product added successfully!");
      }

      // Clear form and reload products
      setProductName("");
      setProductImage(null);
      setEditingProductId(null);
      setOldImageUrl("");
      fetchProducts();
    } catch (error) {
      console.error("Error adding/updating product:", error);
      alert("Error: " + error.message);
    }

    setIsSubmitting(false);
  };

  // Handle editing the product
  const handleEdit = (product) => {
    setProductName(product.name); // Set product name
    setImageUrl(product.imageUrl); // Show current image
    setEditingProductId(product.id); // Set editing state
    setOldImageUrl(product.imageUrl); // Store the old image URL for potential deletion
  };

  // Handle deleting the product
  const handleDelete = async (product) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
    );
    if (!confirmDelete) return;

    try {
      // Delete the image from Firebase Storage
      const imageRef = ref(storage, product.imageUrl);
      await deleteObject(imageRef);

      // Delete the product from Firestore
      await deleteDoc(doc(db, "institutionalProducts", product.id));

      alert("Product deleted successfully!");
      fetchProducts(); // Refresh product list after deletion
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Error deleting product: " + error.message);
    }
  };

  return (
    <div className="mb-10">
      <div className="container max-w-4xl bg-white p-8 rounded-lg shadow-lg">
        <h1 className="md:text-4xl text-2xl font-extrabold text-gray-800 mb-10">
          Institutional Category
        </h1>

        <div className="flex flex-col space-y-10">
          <input
            type="text"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            placeholder="Category Name"
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
            className={`bg-blue-600 text-white p-3 rounded-lg flex items-center justify-center shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              isSubmitting ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>

          {/* Display uploaded images and edit/delete options */}
          <div className="items-center">
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
      </div>
    </div>
  );
};

export default InstitutionalCategory;
