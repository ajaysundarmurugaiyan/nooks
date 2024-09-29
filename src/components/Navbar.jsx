import { useState, useEffect } from "react";
import { MdMenu, MdClose } from "react-icons/md";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";

const NavBar = () => {
  const [is_menu_open, set_is_menu_open] = useState(false);
  const [is_products_open, set_is_products_open] = useState(false);
  const [institutional_products, set_institutional_products] = useState([]);
  const [office_products, set_office_products] = useState([]);
  const [loading, set_loading] = useState(true);
  const [error, set_error] = useState(null);
  const [openDropdown, setOpenDropdown] = useState(null);

  // Toggle the dropdown visibility
  const toggleDropdown = (productId) => {
    setOpenDropdown(openDropdown === productId ? null : productId);
  };

  const toggle_menu = () => {
    set_is_menu_open(!is_menu_open);
    set_is_products_open(false);
  };

  const toggle_products = () => {
    set_is_products_open(!is_products_open);
  };

  useEffect(() => {
    const fetch_products = async () => {
      try {
        // Fetch institutional products
        const institutional_snapshot = await getDocs(
          collection(db, "institutionalProducts")
        );
        const institutional_data = await Promise.all(
          institutional_snapshot.docs.map(async (doc) => {
            const product_data = { id: doc.id, ...doc.data() };
            // Fetch categories for each institutional product
            const categories_snapshot = await getDocs(
              collection(db, `institutionalProducts/${doc.id}/images`)
            );
            // console.log(categories_snapshot)
            product_data.categories = categories_snapshot.docs.map(
              (cat_doc) => ({
                id: cat_doc.id,
                ...cat_doc.data(),
              })
            );
            return product_data;
          })
        );
        set_institutional_products(institutional_data);

        // Fetch office products
        const office_snapshot = await getDocs(collection(db, "officeProducts"));
        const office_data = await Promise.all(
          office_snapshot.docs.map(async (doc) => {
            const product_data = { id: doc.id, ...doc.data() };
            // Fetch categories for each office product
            const categories_snapshot = await getDocs(
              collection(db, `officeProducts/${doc.id}/images`)
            );
            product_data.categories = categories_snapshot.docs.map(
              (cat_doc) => ({
                id: cat_doc.id,
                ...cat_doc.data(),
              })
            );
            return product_data;
          })
        );
        set_office_products(office_data);
      } catch (err) {
        console.error("Error fetching products:", err);
        set_error("Failed to fetch products.");
      } finally {
        set_loading(false);
      }
    };

    fetch_products();
  }, []);

  if (loading) {
    return (
      <div className="fixed top-0 w-full z-50 navigation-bar">
        <nav className="flex items-center justify-between flex-wrap bg-white shadow-md py-4 px-10 md:px-20">
          <div className="w-full text-center">
            <p className="text-gray-600 font-bold text-lg">Loading...</p>
          </div>
        </nav>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed top-0 w-full z-50 navigation-bar">
        <nav className="flex items-center justify-between flex-wrap bg-white shadow-md py-4 px-10 md:px-20">
          <div className="w-full text-center">
            <p className="text-red-600 font-bold text-lg">{error}</p>
          </div>
        </nav>
      </div>
    );
  }

  return (
    <div className="fixed top-0 w-full z-50 navigation-bar">
      <nav className="flex items-center justify-between flex-wrap bg-white shadow-md py-4 px-10 md:px-20">
        <div className="flex items-center flex-shrink-0 text-white mr-6 justify-center h-full text-center logo mt-2">
          <img
            className="md:w-32 w-24 h-auto"
            src="/logo.jpg"
            alt="Nooks Furniture Logo"
          />
        </div>
        <div className="block lg:hidden">
          <button
            onClick={toggle_menu}
            className="toggle-button flex items-center py-2 rounded text-black border-black hover:text-gray-500 hover:border-gray-500"
          >
            {is_menu_open ? <MdClose size={24} /> : <MdMenu size={24} />}
          </button>
        </div>
        <div
          className={`w-full ${
            is_menu_open ? "block" : "hidden"
          } lg:flex lg:items-center lg:w-auto menu-links`}
        >
          <div className="lg:border-none rounded-md lg:mx-0 mx-5">
            <div className="text-sm nav-links lg:flex-grow lg:flex-none lg:flex-row flex flex-col lg:gap-3 items-center lg:items-start">
              <div>
                <a
                  href="/"
                  className="menu-link block mt-4 lg:inline-block lg:mt-0 lg:ml-14 text-gray-600 hover:text-gray-800 font-bold text-md md:text-lg xl:text-xl"
                >
                  Home
                </a>
              </div>

              {/* Products Dropdown */}
              <div className="relative inline-block text-left">
                <span
                  onClick={toggle_products}
                  className="menu-link block mt-4 lg:inline-block lg:mt-0 lg:ml-14 text-gray-600 hover:text-gray-800 font-bold text-md md:text-lg xl:text-xl cursor-pointer"
                >
                  Products
                </span>
                {is_products_open && (
                  <div className="absolute -right-60 sm:-right-96 lg:-right-20  md:-right-60 mt-10 bg-white text-black shadow-lg z-20 text-xs sm:text-sm md:text-lg w-screen md:w-[70vw] p-8">
                    <div className="grid grid-cols-1 gap-4">
                      {/* Institutional Products */}
                      <div className="product-section">
                        {institutional_products.length > 0 ? (
                          <div className="grid md:grid-cols-2 lg:grid-cols-3">
                            {institutional_products.map((product) => (
                              <div key={product.id} className="mb-4">
                                {/* Dropdown for small screens */}
                                <div className="block md:hidden">
                                  <button
                                    onClick={() => toggleDropdown(product.id)}
                                    className="font-bold text-left w-full"
                                  >
                                    <a href={`/institutional-products/${product.id}`}>
                                      <span className="font-bold">
                                        {product.name}
                                      </span>
                                    </a>
                                    <span className="ml-2">
                                      {openDropdown === product.id ? "▲" : "▼"}
                                    </span>
                                  </button>
                                  {openDropdown === product.id &&
                                    product.categories.length > 0 && (
                                      <ul className="list-disc text-xs text-gray-500">
                                        {product.categories.map((category) => (
                                          <div key={category.id}>
                                            <a
                                              href={`/category-images/${product.id}/${category.id}`}
                                            >
                                              {category.categoryName}
                                            </a>
                                          </div>
                                        ))}
                                      </ul>
                                    )}
                                </div>

                                {/* Default view for medium and larger screens */}
                                <div className="hidden md:block">
                                  <a href={`/institutional-products/${product.id}`}>
                                    <span className="font-bold">
                                      {product.name}
                                    </span>
                                  </a>
                                  {product.categories.length > 0 && (
                                    <ul className="list-disc text-xs text-gray-500">
                                      {product.categories.map((category) => (
                                        <div key={category.id}>
                                          <a
                                            href={`/category-images/${product.id}/${category.id}`}
                                          >
                                            {category.categoryName}
                                          </a>
                                        </div>
                                      ))}
                                    </ul>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p>No institutional products found.</p>
                        )}
                      </div>

                      {/* Office Products */}
                      <div className="product-section grid grid-cols-3">
                        {office_products.length > 0 ? (
                          office_products.map((product) => (
                            <div key={product.id} className="mb-4">
                              <a href={`/office-products/${product.id}`}>
                                <span className="font-bold">
                                  {product.name}
                                </span>
                              </a>
                              {/* {product.categories.length > 0 && (
                                <ul className="ml-4 list-disc text-gray-500">
                                  {product.categories.map((category) => (
                                    <li key={category.id}>{category.categoryName}</li>
                                  ))}
                                </ul>
                              )} */}
                            </div>
                          ))
                        ) : (
                          <p>No office products found.</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="lg:relative inline-block text-left">
                <a
                  href="/contact-us"
                  className="menu-link block mt-4 lg:inline-block lg:mt-0 text-gray-600 hover:text-gray-800 font-bold text-md md:text-lg lg:ml-14 xl:text-xl"
                >
                  Contact Us
                </a>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default NavBar;
