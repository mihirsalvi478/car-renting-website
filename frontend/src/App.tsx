import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Home from "./pages/Home";
import CarsPages from "./pages/Cars.pages";
import Layout from "./components/Layout";
import PackagesPage from "./pages/Packages.page";
import CarDetailPage from "./pages/CarDetailsPage";
import PackageDetailPage from "./pages/PackageDetail";
import { ToastContainer } from "react-toastify";
import { Signup } from "./components/Signup";
import { Signin } from "./components/Signin";
import AuthLayout from "./components/AuthLayout";
import Contact from "./components/Contacts";
import OrdersPage from "./pages/OrdersPage";
import BookingPage from "./pages/BookingPage";
import BookingHistory from "./pages/BookingHistory";
import ProfileDashboard from "./pages/ProfileDashboard";
import PaymentPage from "./pages/PaymentPage";
import AdminDashboard from "./pages/AdminDashboard";

function App() {
  return (
    <Router>
      <ToastContainer />

      <Routes>
        {/* Routes without Appbar/Footer */}
        <Route
          path="/signup"
          element={
            <AuthLayout>
              <Signup />
            </AuthLayout>
          }
        />
        <Route
          path="/signin"
          element={
            <AuthLayout>
              <Signin />
            </AuthLayout>
          }
        />

        {/* Routes with Appbar/Footer */}
        <Route
          path="/"
          element={
            <Layout>
              <Home />
            </Layout>
          }
        />
        <Route
          path="/cars"
          element={
            <Layout>
              <CarsPages />
            </Layout>
          }
        />
        <Route
          path="/car/:id"
          element={
            <Layout>
              <CarDetailPage />
            </Layout>
          }
        />
        <Route
          path="/packages"
          element={
            <Layout>
              <PackagesPage />
            </Layout>
          }
        />
        <Route
          path="/packages/:id"
          element={
            <Layout>
              <PackageDetailPage />
            </Layout>
          }
        />
        <Route
          path="/contact-us"
          element={
            <Layout>
              <Contact />
            </Layout>
          }
        />
        <Route
          path="/booking-page"
          element={
            <Layout>
              <OrdersPage />
            </Layout>
          }
        />
        <Route
          path="/bookings"
          element={
            <Layout>
              <BookingPage />
            </Layout>
          }
        />
        <Route
          path="/my-bookings"
          element={
            <Layout>
              <BookingHistory />
            </Layout>
          }
        />
        <Route
          path="/profile"
          element={
            <Layout>
              <ProfileDashboard />
            </Layout>
          }
        />
        <Route
          path="/payment"
          element={
            <Layout>
              <PaymentPage />
            </Layout>
          }
        />

        {/* Admin Routes (no Layout wrapper) */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />

        <Route path="*" element={<div>404 Not Found</div>} />
      </Routes>
    </Router>
  );
}

export default App;
