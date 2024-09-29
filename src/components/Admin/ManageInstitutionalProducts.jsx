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

function ManageInstitutionalProducts() {
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [productName, setProductName] = useState(""); // New state for product name
  const [categories, setCategories] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // Fetch all categories from the "institutionalProducts" collection
        const snapshot = await getDocs(collection(db, "institutionalProducts"));
        const categoryList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setCategories(categoryList.map((cat) => cat.name)); // Use document ID as category name

        // Fetch products for the default selected category
        if (categoryList.length > 0) {
          const defaultCategory = categoryList[0].id;
          setSelectedCategory(defaultCategory);
          fetchProducts(defaultCategory);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    console.log(products);

    fetchCategories();
  }, []);

  const fetchProducts = async (category) => {
    try {
      // Fetch products from the selected category
      const snapshot = await getDocs(
        collection(db, "institutionalCategory", category, "Items")
      );
      const productList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProducts(productList);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const handleAddOrUpdateProduct = async () => {
    if (!selectedCategory || !imageFile || !productName) {
      return alert("Please select a category, enter a product name, and upload an image");
    }

    try {
      const storageRef = ref(storage, `${selectedCategory}/${imageFile.name}`);
      await uploadBytes(storageRef, imageFile);
      const imageUrl = await getDownloadURL(storageRef);

      const productData = {
        name: productName, // Use the user-entered product name
        imageUrl,
      };

      if (editingProduct) {
        // Update existing product
        const productRef = doc(
          db,
          "institutionalCategory",
          selectedCategory,
          "Items",
          editingProduct.id
        );
        await updateDoc(productRef, productData);
        alert("Product updated successfully");
      } else {
        // Add new product
        await addDoc(
          collection(db, "institutionalCategory", selectedCategory, "Items"),
          productData
        );
        alert("Product added successfully");
      }

      // Reset form
      setSelectedCategory("");
      setImageFile(null);
      setProductName(""); // Clear product name
      setEditingProduct(null);

      // Refresh product list
      fetchProducts(selectedCategory);
    } catch (error) {
      console.error("Error adding/updating product:", error);
      alert("An error occurred while adding/updating the product");
    }
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setProductName(product.name); // Populate the product name when editing
    setImageFile(null); // Clear previous image file
  };

  const handleDeleteProduct = async (id) => {
    try {
      const productRef = doc(
        db,
        "institutionalCategory",
        selectedCategory,
        "Items",
        id
      );
      await deleteDoc(productRef);
      alert("Product deleted successfully");
      fetchProducts(selectedCategory);
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("An error occurred while deleting the product");
    }
  };

  return (
    <div className="mb-12">
      <h3 className="text-2xl font-semibold mb-6 text-gray-800">
        Manage Institutional Products
      </h3>

      <div className="flex flex-col space-y-4 mb-8">
        <select
          value={selectedCategory}
          onChange={(e) => {
            setSelectedCategory(e.target.value);
            fetchProducts(e.target.value);
          }}
          className="p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        {/* Input for Product Name */}
        <input
          type="text"
          placeholder="Enter Product Name"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          className="p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

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

export default ManageInstitutionalProducts;