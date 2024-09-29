import { useState, useEffect } from "react";
import { collection, getDocs,db } from "./firebase";
import InstitutionalProducts from "./components/Product/Institutional/Main";
import OfficeProducts from "./components/Product/Office/Main";


function Fetch() {
  const [institutionalProducts, setInstitutionalProducts] = useState([]);
  const [officeProducts, setOfficeProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const institutionalSnapshot = await getDocs(
          collection(db, "institutionalProducts")
        );
        const officeSnapshot = await getDocs(
          collection(db, "officeProducts")
        );

        const institutionalProductsData = institutionalSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        const officeProductsData = officeSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setInstitutionalProducts(institutionalProductsData);
        setOfficeProducts(officeProductsData);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8 text-center">Our Products</h1>

      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Institutional Products</h2>
        <InstitutionalProducts products={institutionalProducts} />
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Office Products</h2>
        <OfficeProducts products={officeProducts} />
      </div>
    </div>
  );
}

export default Fetch;
