import React, { createContext, useContext, useState } from 'react';
import { Category, Product, Subcategory, Series, Material, Warranty, Certification, ProductDetail } from '../components/Admin/types/database';
import * as mockData from '../components/Admin/data/mockData';

const DataContext = createContext(undefined);

export function DataProvider({ children }) {
  const [categories, setCategories] = useState(mockData.categories);
  const [products, setProducts] = useState(mockData.products);
  const [subcategories, setSubcategories] = useState(mockData.subcategories);
  const [series, setSeries] = useState(mockData.series);
  const [materials, setMaterials] = useState(mockData.materials);
  const [warranties, setWarranties] = useState(mockData.warranties);
  const [certifications, setCertifications] = useState(mockData.certifications);
  const [productDetails, setProductDetails] = useState(mockData.productDetails);

  // Category CRUD
  const addCategory = (item) => setCategories(prev => [...prev, item]);
  const updateCategory = (id, item) => 
    setCategories(prev => prev.map(c => c.category_id === id ? { ...c, ...item } : c));
  const deleteCategory = (id) => setCategories(prev => prev.filter(c => c.category_id !== id));

  // Product CRUD
  const addProduct = (item) => setProducts(prev => [...prev, item]);
  const updateProduct = (id, item) => 
    setProducts(prev => prev.map(p => p.product_id === id ? { ...p, ...item } : p));
  const deleteProduct = (id) => setProducts(prev => prev.filter(p => p.product_id !== id));

  // Subcategory CRUD
  const addSubcategory = (item) => setSubcategories(prev => [...prev, item]);
  const updateSubcategory = (id, item) => 
    setSubcategories(prev => prev.map(s => s.subcat_id === id ? { ...s, ...item } : s));
  const deleteSubcategory = (id) => setSubcategories(prev => prev.filter(s => s.subcat_id !== id));

  // Series CRUD
  const addSeries = (item) => setSeries(prev => [...prev, item]);
  const updateSeries = (id, item) => 
    setSeries(prev => prev.map(s => s.series_id === id ? { ...s, ...item } : s));
  const deleteSeries = (id) => setSeries(prev => prev.filter(s => s.series_id !== id));

  // Material CRUD
  const addMaterial = (item) => setMaterials(prev => [...prev, item]);
  const updateMaterial = (id, item) => 
    setMaterials(prev => prev.map(m => m.material_id === id ? { ...m, ...item } : m));
  const deleteMaterial = (id) => setMaterials(prev => prev.filter(m => m.material_id !== id));

  // Warranty CRUD
  const addWarranty = (item) => setWarranties(prev => [...prev, item]);
  const updateWarranty = (id, item) => 
    setWarranties(prev => prev.map(w => w.warranty_id === id ? { ...w, ...item } : w));
  const deleteWarranty = (id) => setWarranties(prev => prev.filter(w => w.warranty_id !== id));

  // Certification CRUD
  const addCertification = (item) => setCertifications(prev => [...prev, item]);
  const updateCertification = (id, item) => 
    setCertifications(prev => prev.map(c => c.cert_id === id ? { ...c, ...item } : c));
  const deleteCertification = (id) => setCertifications(prev => prev.filter(c => c.cert_id !== id));

  // ProductDetail CRUD
  const addProductDetail = (item) => {
    const newId = Math.max(...productDetails.map(p => p.detail_id), 0) + 1;
    setProductDetails(prev => [...prev, { ...item, detail_id: newId }]);
  };
  const updateProductDetail = (id, item) => 
    setProductDetails(prev => prev.map(p => p.detail_id === id ? { ...p, ...item } : p));
  const deleteProductDetail = (id) => setProductDetails(prev => prev.filter(p => p.detail_id !== id));

  return (
    <DataContext.Provider value={{
      categories, products, subcategories, series, materials, warranties, certifications, productDetails,
      addCategory, updateCategory, deleteCategory,
      addProduct, updateProduct, deleteProduct,
      addSubcategory, updateSubcategory, deleteSubcategory,
      addSeries, updateSeries, deleteSeries,
      addMaterial, updateMaterial, deleteMaterial,
      addWarranty, updateWarranty, deleteWarranty,
      addCertification, updateCertification, deleteCertification,
      addProductDetail, updateProductDetail, deleteProductDetail,
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
