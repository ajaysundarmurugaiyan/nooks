import { useState, useEffect } from "react";
import {
  db,
  storage,
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  ref,
  uploadBytes,
  getDownloadURL,
} from "../../firebase";
import { AiFillPlusCircle, AiFillEdit, AiFillDelete } from "react-icons/ai";

function ManageOfficeProducts() {
  const [products, setProducts] = useState([]);
  const [selectedProductName, setSelectedProductName] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [productOptions, setProductOptions] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    const fetchProductNames = async () => {
      try {
        // Fetch all product names from the "officeProducts" collection
        const snapshot = await getDocs(collection(db, "officeProducts"));
        const productList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Extract unique product names
        const productNames = [...new Set(productList.map((p) => p.name))];
        setProductOptions(productNames);

        // Fetch products for the default selected product name
        if (productNames.length > 0) {
          const defaultName = productNames[0];
          setSelectedProductName(defaultName);
          fetchProductDetails(defaultName);
        }
      } catch (error) {
        console.error("Error fetching product names:", error);
      }
    };

    fetchProductNames();
  }, []);

  const fetchProductDetails = async (name) => {
    try {
      // Fetch products from the selected product name
      const snapshot = await getDocs(collection(db, "officeProducts", name, "Items"));
      const productList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProducts(productList);
    } catch (error) {
      console.error("Error fetching product details:", error);
    }
  };

  const handleAddOrUpdateProduct = async () => {
    if (!selectedProductName || !imageFile) {
      return alert("Please select a product name and upload an image");
    }

    try {
      const storageRef = ref(storage, `${selectedProductName}/${imageFile.name}`);
      await uploadBytes(storageRef, imageFile);
      const imageUrl = await getDownloadURL(storageRef);

      const productData = {
        name: selectedProductName,
        imageUrl,
      };

      if (editingProduct) {
        // Update existing product
        const productRef = doc(db, "officeCategory", selectedProductName, "Items", editingProduct.id);
        await updateDoc(productRef, productData);
        alert("Product updated successfully");
      } else {
        // Add new product
        await addDoc(collection(db, "officeCategory", selectedProductName, "Items"), productData);
        alert("Product added successfully");
      }

      // Reset form
      setSelectedProductName("");
      setImageFile(null);
      setEditingProduct(null);

      // Refresh product list
      fetchProductDetails(selectedProductName);
    } catch (error) {
      console.error("Error adding/updating product:", error);
      alert("An error occurred while adding/updating the product");
    }
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setImageFile(null); // Clear previous image file
  };

  const handleDeleteProduct = async (id) => {
    try {
      const productRef = doc(db, "officeCategory", selectedProductName, "Items", id);
      await deleteDoc(productRef);
      alert("Product deleted successfully");
      fetchProductDetails(selectedProductName);
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("An error occurred while deleting the product");
    }
  };

  return (
    <div className="mb-12">
      <h3 className="text-2xl font-semibold mb-6 text-gray-800">Manage Office Products</h3>

      <div className="flex flex-col space-y-4 mb-8">
        <select
          value={selectedProductName}
          onChange={(e) => {
            setSelectedProductName(e.target.value);
            fetchProductDetails(e.target.value);
          }}
          className="p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select Product Name</option>
          {productOptions.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImageFile(e.target.files[0])}
          className="p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          onClick={handleAddOrUpdateProduct}
          className="bg-blue-600 text-white p-3 rounded-lg flex items-center justify-center shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <AiFillPlusCircle className="mr-2" />
          {editingProduct ? "Update Product" : "Add Product"}
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="border border-gray-300 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-300 relative"
          >
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-48 object-cover mb-4 rounded-lg"
            />
            <h3 className="text-xl font-medium mb-2">{product.name}</h3>
            <div className="absolute top-2 right-2 flex space-x-2">
              <button
                onClick={() => handleEditProduct(product)}
                className="text-blue-500 hover:text-blue-700"
              >
                <AiFillEdit size={24} />
              </button>
              <button
                onClick={() => handleDeleteProduct(product.id)}
                className="text-red-500 hover:text-red-700"
              >
                <AiFillDelete size={24} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ManageOfficeProducts;
