import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Layout from "./components/Layout";
import Home from "./pages/Home"
import Auth from "./pages/Auth";
import Products from "./pages/Products";
import Categories from "./pages/Categories";
import { UserProvider } from "./context/UserContext";
import Dashboard from "./pages/Dashboard";
import DashboardCategories from "./pages/DashboardCategories";
import DashboardProducts from "./pages/DashboardProducts";

export default function App() {
  return (
    <UserProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Layout />} />
          <Route index element={<Home />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/products" element={<Products />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/categories" element={<DashboardCategories />} />
          <Route path="/dashboard/products" element={<DashboardProducts />} />
        </Routes>
      </BrowserRouter>
    </UserProvider>
  );
}
