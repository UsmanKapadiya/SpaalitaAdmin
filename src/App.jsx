import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import { Suspense, lazy } from 'react';
const Login = lazy(() => import('./pages/Login/Login'));
const Dashboard = lazy(() => import('./pages/Dashboard/Dashboard'));
// const About = lazy(() => import('./pages/About/About'));
// const EditAbout = lazy(() => import('./pages/About/EditAbout'));
// const News = lazy(() => import('./pages/News/News'));
// const EditNews = lazy(() => import('./pages/News/EditNews'));
// const Gallery = lazy(() => import('./pages/Gallery/Gallery'));
// const EditGallery = lazy(() => import('./pages/Gallery/EditGallery'));
// const EditVideoGallery = lazy(() => import('./pages/Gallery/EditVideoGallery'));
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './index.css';

import Product from './pages/Product/product';
import ProductForm from './pages/Product/ProductForm';
import GiftCard from './pages/GiftCard/giftcard';
import GiftCardForm from './pages/GiftCard/GiftCardForm';
import Services from './pages/Services/Services';
import ServicesForm from './pages/Services/ServicesForm';
import BookingPolicy from './pages/BookingPolicy/BookingPolicy';
import BookingPolicyForm from './pages/BookingPolicy/BookingPolicyForm';
import MonthlySpecial from './pages/MonthlySpecial/MonthlySpecial';
import MonthlySpecialForm from './pages/MonthlySpecial/MonthlySpecialForm';
import Gallery from './pages/Gallery/Gallery';
import GalleryForm from './pages/Gallery/galleryForm';
import User from './pages/User/User';
import UserForm from './pages/User/UserForm';
import OrderPage from './pages/Order/OrderPage';
import OrderDetails from './pages/Order/OrderDetails';
import ProductDetails from './pages/Product/ProductDetails';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/product"
              element={
                <ProtectedRoute>
                  <Product />
                </ProtectedRoute>
              }
            />
            <Route
              path="/products/edit/:id"
              element={
                <ProtectedRoute>
                  <ProductForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/productsDetails"
              element={
                <ProtectedRoute>
                  <ProductDetails />
                </ProtectedRoute>
              }
            />
            <Route
              path="/giftCards"
              element={
                <ProtectedRoute>
                  <GiftCard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/giftCards/edit/:id"
              element={
                <ProtectedRoute>
                  <GiftCardForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/services"
              element={
                <ProtectedRoute>
                  <Services />
                </ProtectedRoute>
              }
            />
            <Route
              path="/services/edit/:id"
              element={
                <ProtectedRoute>
                  <ServicesForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/bookingPolicy"
              element={
                <ProtectedRoute>
                  <BookingPolicy />
                </ProtectedRoute>
              }
            />
            <Route
              path="/bookingPolicy/edit/:id"
              element={
                <ProtectedRoute>
                  <BookingPolicyForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/monthly-special"
              element={
                <ProtectedRoute>
                  <MonthlySpecial />
                </ProtectedRoute>
              }
            />
            <Route
              path="/monthly-special/edit/:id"
              element={
                <ProtectedRoute>
                  <MonthlySpecialForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/gallery"
              element={
                <ProtectedRoute>
                  <Gallery />
                </ProtectedRoute>
              }
            />
            <Route
              path="/gallery/edit/:id"
              element={
                <ProtectedRoute>
                  <GalleryForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/user"
              element={
                <ProtectedRoute>
                  <User />
                </ProtectedRoute>
              }
            />
            <Route
              path="/user/edit/:id"
              element={
                <ProtectedRoute>
                  <UserForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/orders"
              element={
                <ProtectedRoute>
                  <OrderPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/ordersDetails"
              element={
                <ProtectedRoute>
                  <OrderDetails />
                </ProtectedRoute>
              }
            />
            {/*<Route
              path="/gallery/videos/edit/:id"
              element={
                <ProtectedRoute>
                  <EditVideoGallery />
                </ProtectedRoute>
              }
            /> */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </Suspense>
        <ToastContainer />
      </Router>
    </AuthProvider>
  );
}

export default App;
