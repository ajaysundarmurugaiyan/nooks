import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import CafeteriaDining from "./components/Product/Institutional/CafeteriaDining";
import ClassRoom from "./components/Product/Institutional/ClassRoom";
import Hostel from "./components/Product/Institutional/Hostel";
import Laboratory from "./components/Product/Institutional/Laboratory";
import Library from "./components/Product/Institutional/Library";
import LockersStorage from "./components/Product/Institutional/LockersStorage";
import Office from "./components/Product/Institutional/Office";
import TablesDesks from "./components/Product/Office/TablesDesks";
import Chiars from "./components/Product/Office/Chiars";
import Workstations from "./components/Product/Office/Workstations";
import Storage from "./components/Product/Office/Storage";
import Contact from "./pages/Contact";
import Admin from "./Admin";
import InstitutionalProducts from "./components/Product/Institutional/Main";
import OfficeProducts from "./components/Product/Office/Main";
import Fetch from "./Fetch";
import ProductDetails from "./ProductDetails";
import InstitutionalProductDetails from "./InstitureProductDetails";
import AdminLogin from "./pages/AdminLogin";
import ProtectedRoute from "./ProtectedRoute";
import AdminMain from "./pages/AdminPanel/AdminMain";
import InstitutionalCategory from "./pages/AdminPanel/InstitutionalCategory";
import OfficeCategory from "./pages/AdminPanel/OfficeCategory";
import InstitutionalProduct from "./pages/AdminPanel/InstitutionalProduct";
import OfficeProduct from "./pages/AdminPanel/OfficeProduct";
import IPImages from "./pages/AdminPanel/IPImages";
import OPImages from "./pages/AdminPanel/OPImages";
import ProductImagesPage from "./pages/ProductImagesPage";
import CategoryImages from "./pages/CategoryImages";
import OfficeProductDetails from "./pages/OfficeProductDetails";

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Home */}
        <Route path="/" element={<Home />} />
        <Route path="/fetch" element={<Fetch />} />
        <Route path="/institutional-products/:name" element={<InstitutionalProductDetails />} />
        <Route path="/office-products/:name" element={<OfficeProductDetails />} />
        <Route path="/category-images/:name/:id" element={<CategoryImages />} />
        <Route path="/products/details/:name" element={<ProductDetails />} />
        
        {/* Corrected the usage of element */}
        <Route path="/institutional/:productId" element={<ProductImagesPage />} />
        <Route path="/office/:productId" element={<ProductImagesPage />} />
  
        <Route path="/institutional-category" element={<InstitutionalCategory />} />
        <Route path="/office-category" element={<OfficeCategory />} />
        <Route path="/institutional-product" element={<InstitutionalProduct />} />
        <Route path="/office-product" element={<OfficeProduct />} />
        <Route path="/ip-images" element={<IPImages />} />
        <Route path="/op-images" element={<OPImages />} />

        {/* Product */}
        {/* Institutional */}
        <Route path="/institutional" element={<InstitutionalProducts />} />

        {/* Office */}
        <Route path="/office" element={<OfficeProducts />} />

        {/* Contact */}
        <Route path="/contact-us" element={<Contact />} />

        {/* Admin */}
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/admin" element={<ProtectedRoute element={<AdminMain />} />} />
      </Routes>
    </Router>
  );
};

export default App;
