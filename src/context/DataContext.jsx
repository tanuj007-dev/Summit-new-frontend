import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { Category, Product, Subcategory, Series, Material, Warranty, Certification, ProductDetail } from '../components/Admin/types/database';
import * as mockData from '../components/Admin/data/mockData';

const DataContext = createContext(undefined);

const API_BASE_URL = `${import.meta.env.VITE_APP_API_BASE_URL ?? 'https://api.summithomeappliance.com'}/api/admin`;

export function DataProvider({ children }) {
  const [categories, setCategories] = useState([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);

  // Fetch categories from API on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/categories`);
        console.log('Categories fetched:', response.data);
        // Handle different response formats
        let categoryData = [];
        if (response.data.data && Array.isArray(response.data.data)) {
          categoryData = response.data.data;
        } else if (Array.isArray(response.data)) {
          categoryData = response.data;
        }
        setCategories(categoryData);
      } catch (error) {
        console.error('Error fetching categories:', error.message);
        setCategories([]);
      } finally {
        setIsLoadingCategories(false);
      }
    };
    fetchCategories();
  }, []);

  const [products, setProducts] = useState(mockData.products);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const [subcategories, setSubcategories] = useState(mockData.subcategories);
  const [isLoadingSubcategories, setIsLoadingSubcategories] = useState(false);
  const [series, setSeries] = useState(mockData.series);
  const [isLoadingSeries, setIsLoadingSeries] = useState(false);
  const [materials, setMaterials] = useState(mockData.materials);
  const [isLoadingMaterials, setIsLoadingMaterials] = useState(false);
  const [warranties, setWarranties] = useState(mockData.warranties);
  const [isLoadingWarranties, setIsLoadingWarranties] = useState(false);
  const [certifications, setCertifications] = useState(mockData.certifications);
  const [isLoadingCertifications, setIsLoadingCertifications] = useState(false);
  const [productDetails, setProductDetails] = useState(mockData.productDetails);
  const [isLoadingProductDetails, setIsLoadingProductDetails] = useState(false);

  // Category CRUD
  const addCategory = async (item) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/categories`, item);
      const categoryData = response.data.data || response.data;
      setCategories(prev => [...prev, categoryData]);
      return categoryData;
    } catch (error) {
      console.error('Error adding category:', error);
      throw error;
    }
  };

  const updateCategory = async (id, item) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/categories/${id}`, item);
      setCategories(prev => prev.map(c => c.category_id === id ? { ...c, ...item } : c));
      return response.data;
    } catch (error) {
      console.error('Error updating category:', error);
      throw error;
    }
  };

  const deleteCategory = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/categories/${id}`);
      setCategories(prev => prev.filter(c => c.category_id !== id));
    } catch (error) {
      console.error('Error deleting category:', error);
      throw error;
    }
  };

  // Fetch products from API
  const fetchProducts = async () => {
    try {
      setIsLoadingProducts(true);
      const response = await axios.get(`${API_BASE_URL}/products-main`, {
        withCredentials: true
      });
      console.log('Products fetched:', response.data);
      let productData = [];
      if (response.data.data && Array.isArray(response.data.data)) {
        productData = response.data.data;
      } else if (Array.isArray(response.data)) {
        productData = response.data;
      }
      setProducts(productData);
      return productData;
    } catch (error) {
      console.error('Error fetching products:', error.message);
      setProducts(mockData.products);
    } finally {
      setIsLoadingProducts(false);
    }
  };

  // Load products on mount
  useEffect(() => {
    fetchProducts();
  }, []);

  // Product CRUD
  const addProduct = async (item) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/products-main`, item, {
        withCredentials: true
      });
      console.log('Product added:', response.data);
      const productData = response.data.data || response.data;
      setProducts(prev => [...prev, productData]);
      return productData;
    } catch (error) {
      console.error('Error adding product:', error);
      throw error;
    }
  };

  const updateProduct = async (id, item) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/products-main/${id}`, item, {
        withCredentials: true
      });
      console.log('Product updated:', response.data);
      setProducts(prev => prev.map(p => p.product_id === id ? { ...p, ...item } : p));
      return response.data;
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  };

  const deleteProduct = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/products-main/${id}`, {
        withCredentials: true
      });
      setProducts(prev => prev.filter(p => p.product_id !== id));
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  };

  // Fetch subcategories from API
  const fetchSubcategories = async () => {
    try {
      setIsLoadingSubcategories(true);
      const response = await axios.get(`${API_BASE_URL}/subcategories`, {
        withCredentials: true
      });
      console.log('Subcategories fetched:', response.data);
      let subcategoryData = [];
      if (response.data.data && Array.isArray(response.data.data)) {
        subcategoryData = response.data.data;
      } else if (Array.isArray(response.data)) {
        subcategoryData = response.data;
      }
      setSubcategories(subcategoryData);
      return subcategoryData;
    } catch (error) {
      console.error('Error fetching subcategories:', error.message);
      setSubcategories(mockData.subcategories);
    } finally {
      setIsLoadingSubcategories(false);
    }
  };

  // Load subcategories on mount
  useEffect(() => {
    fetchSubcategories();
  }, []);

  // Subcategory CRUD
  const addSubcategory = async (item) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/subcategories`, item, {
        withCredentials: true
      });
      console.log('Subcategory added:', response.data);
      const subcategoryData = response.data.data || response.data;
      setSubcategories(prev => [...prev, subcategoryData]);
      return subcategoryData;
    } catch (error) {
      console.error('Error adding subcategory:', error);
      throw error;
    }
  };

  const updateSubcategory = async (id, item) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/subcategories/${id}`, item, {
        withCredentials: true
      });
      console.log('Subcategory updated:', response.data);
      setSubcategories(prev => prev.map(s => s.subcat_id === id ? { ...s, ...item } : s));
      return response.data;
    } catch (error) {
      console.error('Error updating subcategory:', error);
      throw error;
    }
  };

  const deleteSubcategory = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/subcategories/${id}`, {
        withCredentials: true
      });
      setSubcategories(prev => prev.filter(s => s.subcat_id !== id));
    } catch (error) {
      console.error('Error deleting subcategory:', error);
      throw error;
    }
  };

  // Fetch series from API
  const fetchSeries = async () => {
    try {
      setIsLoadingSeries(true);
      const response = await axios.get(`${API_BASE_URL}/series`, {
        withCredentials: true
      });
      console.log('Series fetched:', response.data);
      let seriesData = [];
      if (response.data.data && Array.isArray(response.data.data)) {
        seriesData = response.data.data;
      } else if (Array.isArray(response.data)) {
        seriesData = response.data;
      }
      setSeries(seriesData);
      return seriesData;
    } catch (error) {
      console.error('Error fetching series:', error.message);
      setSeries(mockData.series);
    } finally {
      setIsLoadingSeries(false);
    }
  };

  // Load series on mount
  useEffect(() => {
    fetchSeries();
  }, []);

  // Series CRUD
  const addSeries = async (item) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/series`, item, {
        withCredentials: true
      });
      console.log('Series added:', response.data);
      const seriesData = response.data.data || response.data;
      setSeries(prev => [...prev, seriesData]);
      return seriesData;
    } catch (error) {
      console.error('Error adding series:', error);
      throw error;
    }
  };

  const updateSeries = async (id, item) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/series/${id}`, item, {
        withCredentials: true
      });
      console.log('Series updated:', response.data);
      setSeries(prev => prev.map(s => s.series_id === id ? { ...s, ...item } : s));
      return response.data;
    } catch (error) {
      console.error('Error updating series:', error);
      throw error;
    }
  };

  const deleteSeries = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/series/${id}`, {
        withCredentials: true
      });
      setSeries(prev => prev.filter(s => s.series_id !== id));
    } catch (error) {
      console.error('Error deleting series:', error);
      throw error;
    }
  };

  // Fetch materials from API
  const fetchMaterials = async () => {
    try {
      setIsLoadingMaterials(true);
      const response = await axios.get(`${API_BASE_URL}/materials`, {
        withCredentials: true
      });
      console.log('Materials fetched:', response.data);
      let materialData = [];
      if (response.data.data && Array.isArray(response.data.data)) {
        materialData = response.data.data;
      } else if (Array.isArray(response.data)) {
        materialData = response.data;
      }
      setMaterials(materialData);
      return materialData;
    } catch (error) {
      console.error('Error fetching materials:', error.message);
      setMaterials(mockData.materials);
    } finally {
      setIsLoadingMaterials(false);
    }
  };

  // Load materials on mount
  useEffect(() => {
    fetchMaterials();
  }, []);

  // Material CRUD
  const addMaterial = async (item) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/materials`, item, {
        withCredentials: true
      });
      console.log('Material added:', response.data);
      const materialData = response.data.data || response.data;
      setMaterials(prev => [...prev, materialData]);
      return materialData;
    } catch (error) {
      console.error('Error adding material:', error);
      throw error;
    }
  };

  const updateMaterial = async (id, item) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/materials/${id}`, item, {
        withCredentials: true
      });
      console.log('Material updated:', response.data);
      setMaterials(prev => prev.map(m => m.material_id === id ? { ...m, ...item } : m));
      return response.data;
    } catch (error) {
      console.error('Error updating material:', error);
      throw error;
    }
  };

  const deleteMaterial = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/materials/${id}`, {
        withCredentials: true
      });
      setMaterials(prev => prev.filter(m => m.material_id !== id));
    } catch (error) {
      console.error('Error deleting material:', error);
      throw error;
    }
  };

  // Fetch warranties from API
  const fetchWarranties = async () => {
    try {
      setIsLoadingWarranties(true);
      const response = await axios.get(`${API_BASE_URL}/warranty`, {
        withCredentials: true
      });
      console.log('Warranties fetched:', response.data);
      let warrantyData = [];
      if (response.data.data && Array.isArray(response.data.data)) {
        warrantyData = response.data.data;
      } else if (Array.isArray(response.data)) {
        warrantyData = response.data;
      }
      setWarranties(warrantyData);
      return warrantyData;
    } catch (error) {
      console.error('Error fetching warranties:', error.message);
      setWarranties(mockData.warranties);
    } finally {
      setIsLoadingWarranties(false);
    }
  };

  // Load warranties on mount
  useEffect(() => {
    fetchWarranties();
  }, []);

  // Load certifications on mount
  useEffect(() => {
    fetchCertifications();
  }, []);

  // Fetch product details from API
  const fetchProductDetails = async () => {
    try {
      setIsLoadingProductDetails(true);
      const response = await axios.get(`${API_BASE_URL}/product-details`, {
        withCredentials: true
      });
      console.log('Product details fetched:', response.data);
      let detailData = [];
      if (response.data.data && Array.isArray(response.data.data)) {
        detailData = response.data.data;
      } else if (Array.isArray(response.data)) {
        detailData = response.data;
      }
      setProductDetails(detailData);
      return detailData;
    } catch (error) {
      console.error('Error fetching product details:', error.message);
      setProductDetails(mockData.productDetails);
    } finally {
      setIsLoadingProductDetails(false);
    }
  };

  // Load product details on mount
  useEffect(() => {
    fetchProductDetails();
  }, []);

  // Warranty CRUD
  const addWarranty = async (item) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/warranty`, item, {
        withCredentials: true
      });
      console.log('Warranty added:', response.data);
      const warrantyData = response.data.data || response.data;
      setWarranties(prev => [...prev, warrantyData]);
      return warrantyData;
    } catch (error) {
      console.error('Error adding warranty:', error);
      throw error;
    }
  };

  const updateWarranty = async (id, item) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/warranty/${id}`, item, {
        withCredentials: true
      });
      console.log('Warranty updated:', response.data);
      setWarranties(prev => prev.map(w => w.warranty_id === id ? { ...w, ...item } : w));
      return response.data;
    } catch (error) {
      console.error('Error updating warranty:', error);
      throw error;
    }
  };

  const deleteWarranty = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/warranty/${id}`, {
        withCredentials: true
      });
      setWarranties(prev => prev.filter(w => w.warranty_id !== id));
    } catch (error) {
      console.error('Error deleting warranty:', error);
      throw error;
    }
  };

  // Fetch certifications from API
  const fetchCertifications = async () => {
    try {
      setIsLoadingCertifications(true);
      const response = await axios.get(`${API_BASE_URL}/certifications`, {
        withCredentials: true
      });
      console.log('Certifications fetched:', response.data);
      let certificationData = [];
      if (response.data.data && Array.isArray(response.data.data)) {
        certificationData = response.data.data;
      } else if (Array.isArray(response.data)) {
        certificationData = response.data;
      }
      setCertifications(certificationData);
      return certificationData;
    } catch (error) {
      console.error('Error fetching certifications:', error.message);
      setCertifications(mockData.certifications);
    } finally {
      setIsLoadingCertifications(false);
    }
  };

  // Certification CRUD
  const addCertification = async (item) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/certifications`, item, {
        withCredentials: true
      });
      console.log('Certification added:', response.data);
      const certificationData = response.data.data || response.data;
      setCertifications(prev => [...prev, certificationData]);
      return certificationData;
    } catch (error) {
      console.error('Error adding certification:', error);
      throw error;
    }
  };

  const updateCertification = async (id, item) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/certifications/${id}`, item, {
        withCredentials: true
      });
      setCertifications(prev => prev.map(c => c.cert_id === id ? { ...c, ...item } : c));
      return response.data;
    } catch (error) {
      console.error('Error updating certification:', error);
      throw error;
    }
  };

  const deleteCertification = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/certifications/${id}`, {
        withCredentials: true
      });
      setCertifications(prev => prev.filter(c => c.cert_id !== id));
    } catch (error) {
      console.error('Error deleting certification:', error);
      throw error;
    }
  };

  // ProductDetail CRUD
  const addProductDetail = async (item) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/product-details`, item, {
        withCredentials: true
      });
      console.log('Product detail added:', response.data);
      const detailData = response.data.data || response.data;
      setProductDetails(prev => [...prev, detailData]);
      return detailData;
    } catch (error) {
      console.error('Error adding product detail:', error);
      throw error;
    }
  };

  const updateProductDetail = async (id, item) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/product-details/${id}`, item, {
        withCredentials: true
      });
      console.log('Product detail updated:', response.data);
      setProductDetails(prev => prev.map(p => p.detail_id === id ? { ...p, ...item } : p));
      return response.data;
    } catch (error) {
      console.error('Error updating product detail:', error);
      throw error;
    }
  };

  const deleteProductDetail = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/product-details/${id}`, {
        withCredentials: true
      });
      setProductDetails(prev => prev.filter(p => p.detail_id !== id));
    } catch (error) {
      console.error('Error deleting product detail:', error);
      throw error;
    }
  };

  return (
    <DataContext.Provider
      value={{
        categories,
        isLoadingCategories,
        products,
        isLoadingProducts,
        subcategories,
        isLoadingSubcategories,
        series,
        isLoadingSeries,
        materials,
        isLoadingMaterials,
        warranties,
        fetchProductDetails,
        isLoadingWarranties,
        certifications,
        isLoadingCertifications,
        productDetails,
        isLoadingProductDetails,
        addCategory,
        updateCategory,
        deleteCategory,
        addProduct,
        updateProduct,
        deleteProduct,
        fetchProducts,
        addSubcategory,
        updateSubcategory,
        deleteSubcategory,
        fetchSubcategories,
        addSeries,
        updateSeries,
        deleteSeries,
        fetchSeries,
        addMaterial,
        updateMaterial,
        deleteMaterial,
        fetchMaterials,
        addWarranty,
        updateWarranty,
        deleteWarranty,
        fetchWarranties,
        addCertification,
        updateCertification,
        deleteCertification,
        fetchCertifications,
        addProductDetail,
        updateProductDetail,
        deleteProductDetail,
      }}
    >
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
