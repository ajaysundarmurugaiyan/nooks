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
} from "./firebase";
import {
  AiFillPlusCircle,
  AiFillEdit,
  AiFillDelete,
} from "react-icons/ai";
import ManageInstitutionalProducts from "./components/Admin/ManageInstitutionalProducts";
import ManageOfficeProducts from "./components/Admin/ManageOfficeProducts";
// import ManageInstitutionalProducts from "../components/ManageInstitution";
// import ManageOfficeProducts from "../components/ManageOffice";

function Admin() {
  const [products, setProducts] = useState({ institutional: [], office: [] });
  const [productName, setProductName] = useState("");
  const [productType, setProductType] = useState("institutional"); // Default to 'institutional'
  const [imageFile, setImageFile] = useState(null);
  const [editingProductId, setEditingProductId] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const institutionalSnapshot = await getDocs(
          collection(db, "institutionalProducts")
        );
        const officeSnapshot = await getDocs(
          collection(db, "officeProducts")
        );

        const institutionalProducts = institutionalSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        const officeProducts = officeSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setProducts({
          institutional: institutionalProducts,
          office: officeProducts,
        });
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  const handleAddOrUpdateProduct = async () => {
    if (!productName || !imageFile) {
      return alert("Please fill out all fields");
    }

    try {
      // Upload image to Firebase Storage
      const storageRef = ref(
        storage,
        `${productType}Products/${imageFile.name}`
      );
      await uploadBytes(storageRef, imageFile);
      const imageUrl = await getDownloadURL(storageRef);

      const productData = {
        name: productName,
        imageUrl,
      };

      if (editingProductId) {
        // Update existing product
        await updateDoc(
          doc(db, `${productType}Products`, editingProductId),
          productData
        );
        alert("Product updated successfully");
      } else {
        // Add new product
        await addDoc(collection(db, `${productType}Products`), productData);
        alert("Product added successfully");
      }

      // Reset form
      setProductName("");
      setImageFile(null);
      setEditingProductId(null);

      // Refresh products list
      const updatedSnapshot = await getDocs(
        collection(db, `${productType}Products`)
      );
      setProducts((prev) => ({
        ...prev,
        [productType]: updatedSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })),
      }));
    } catch (error) {
      console.error("Error adding/updating product:", error);
      alert("An error occurred while adding/updating the product");
    }
  };

  const handleEditProduct = (product, type) => {
    setProductName(product.name);
    setProductType(type);
    setEditingProductId(product.id);
  };

  const handleDeleteProduct = async (id, type) => {
    try {
      await deleteDoc(doc(db, `${type}Products`, id));
      alert("Product deleted successfully");
      setProducts((prev) => ({
        ...prev,
        [type]: prev[type].filter((product) => product.id !== id),
      }));
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("An error occurred while deleting the product");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center pt-10">
      <h1 className="text-4xl font-extrabold text-gray-800 mb-10">Admin Panel</h1>

      <div className="container max-w-4xl bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold mb-6 text-gray-800">Manage Products</h2>
        
        {/* Product Type Selection */}
        <div className="flex flex-col space-y-4 mb-8">
          <select
            value={productType}
            onChange={(e) => setProductType(e.target.value)}
            className="p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="institutional">Institutional Product</option>
            <option value="office">Office Product</option>
          </select>

          {/* Product Name Input */}
          <input
            type="text"
            placeholder="Product Name"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            className="p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* Image File Input */}
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files[0])}
            className="p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* Add/Update Button */}
          <button
            onClick={handleAddOrUpdateProduct}
            className="bg-blue-600 text-white p-3 rounded-lg flex items-center justify-center shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <AiFillPlusCircle className="mr-2" />
            {editingProductId ? "Update Product" : "Add Product"}
          </button>
        </div>

        {/* Display Institutional Products */}
        <div className="mb-12">
          <h3 className="text-2xl font-semibold mb-6 text-gray-800">Institutional Products</h3>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.institutional.map((product) => (
              <div
                key={product.id}
                className="border border-gray-300 rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow duration-300 relative bg-white"
              >
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-48 object-cover mb-4 rounded-lg"
                />
                <h3 className="text-xl font-medium mb-2">{product.name}</h3>
                <div className="absolute top-2 right-2 flex space-x-2">
                  <button
                    onClick={() => handleEditProduct(product, "institutional")}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    <AiFillEdit size={24} />
                  </button>
                  <button
                    onClick={() => handleDeleteProduct(product.id, "institutional")}
                    className="text-red-500 hover:text-red-700"
                  >
                    <AiFillDelete size={24} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Display Office Products */}
        <div>
          <h3 className="text-2xl font-semibold mb-6 text-gray-800">Office Products</h3>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.office.map((product) => (
              <div
                key={product.id}
                className="border border-gray-300 rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow duration-300 relative bg-white"
              >
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-48 object-cover mb-4 rounded-lg"
                />
                <h3 className="text-xl font-medium mb-2">{product.name}</h3>
                <div className="absolute top-2 right-2 flex space-x-2">
                  <button
                    onClick={() => handleEditProduct(product, "office")}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    <AiFillEdit size={24} />
                  </button>
                  <button
                    onClick={() => handleDeleteProduct(product.id, "office")}
                    className="text-red-500 hover:text-red-700"
                  >
                    <AiFillDelete size={24} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-20 mb-60 border-t-2 ">
          <h3 className="text-center my-10 font-semibold text-2xl uppercase">Manage Product Category</h3>
        <ManageInstitutionalProducts/>
        <ManageOfficeProducts/>
        </div>
      </div>
      <div className="mb-40">
      </div>
    </div>
  );
}

export default Admin;
