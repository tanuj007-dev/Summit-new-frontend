import { useData } from '../../../context/DataContext';
import { MainLayout } from '../layout/MainLayout';
import { PageHeader } from '../layout/PageHeader';
import { Package, Layers, Grid3X3, TrendingUp, IndianRupee } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const { categories, products, productDetails, materials, warranties } = useData();

  const stats = [
    {
      name: 'Total Products',
      value: products.length,
      icon: Package,
      color: 'text-[#DB7706]',
      bgColor: 'bg-[#FBF1E6]',
      href: '/products',
    },
    {
      name: 'Product Details',
      value: productDetails.length,
      icon: Layers,
      color: 'text-success',
      bgColor: 'bg-success/10',
      href: '/product-details',
    },
    {
      name: 'Categories',
      value: categories.length,
      icon: Grid3X3,
      color: 'text-blue-600',
      bgColor: 'bg-blue-600/10',
      href: '/categories',
    },
    {
      name: 'Total MRP Value',
      value: `₹${productDetails.reduce((acc, p) => acc + (parseFloat(p.mrp) || 0), 0).toLocaleString('en-IN')}`,
      icon: IndianRupee,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-600/10',
      href: '/product-details',
    },
  ];

  const categoryStats = categories.map(cat => ({
    ...cat,
    productCount: products.filter(p => p.category_id === cat.category_id).length,
  })).filter(c => c.productCount > 0).sort((a, b) => b.productCount - a.productCount);

  return (
     <MainLayout>
      <PageHeader 
        title="Dashboard" 
        description="Overview of your product catalog"
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <Link
            key={stat.name}
            to={stat.href}
            className="stat-card border-xl hover:border-[#FBF1E6] group"
          >
            <div className="flex items-center gap-4">
              <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.bgColor}`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{stat.name}</p>
                <p className="text-2xl font-semibold text-foreground">{stat.value}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Categories Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="form-section">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Products by Category</h2>
            <Link to="/categories" className="text-sm text-[#DB7706] hover:underline">View all</Link>
          </div>
          <div className="space-y-3">
            {categoryStats.slice(0, 6).map((cat) => (
              <div key={cat.category_id} className="flex items-center justify-between p-3 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-xl bg-[#DB7706]" />
                  <span className="font-medium text-md">{cat.category_name}</span>
                </div>
                <span className="text-sm text-gray-500">{cat.productCount} products</span>
              </div>
            ))}
            {categoryStats.length === 0 && (
              <p className="text-center text-muted-foreground py-4">No products yet</p>
            )}
          </div>
        </div>

        <div className="form-section">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Recent Products</h2>
            <Link to="/products" className="text-sm text-[#DB7706] hover:underline">View all</Link>
          </div>
          <div className="space-y-3">
            {products.slice(0, 6).map((product) => {
              const category = categories.find(c => c.category_id === product.category_id);
              return (
                <div key={product.product_id} className="flex items-center justify-between p-3 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors">
                  <div>
                    <p className="font-medium text-sm">{product.product_name}</p> 
                    <p className="text-xs text-muted-foreground">{product.product_id}</p>
                  </div>
                  <span className="text-xs px-2 py-1 rounded-lg bg-[#DB7706]/10 text-[#DB7706]">
                    {category?.category_name || 'N/A'}
                  </span>
                </div>
              );
            })}
            {products.length === 0 && (
              <p className="text-center text-muted-foreground py-4">No products yet</p>
            )}
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl border border-border bg-card">
          <p className="text-sm text-muted-foreground">Materials</p>
          <p className="text-xl font-semibold mt-1">{materials.length}</p>
        </div>
        <div className="p-4 rounded-xl border border-border bg-card">
          <p className="text-sm text-muted-foreground">Warranties</p>
          <p className="text-xl font-semibold mt-1">{warranties.length}</p>
        </div>
        <div className="p-4 rounded-xl border border-border bg-card">
          <p className="text-sm text-muted-foreground">Avg. Tax Rate</p>
          <p className="text-xl font-semibold mt-1">
            {products.length ? (products.reduce((a, p) => a + p.tax_rate, 0) / products.length * 100).toFixed(1) : 0}%
          </p>
        </div>
        <div className="p-4 rounded-xl border border-border bg-card">
          <p className="text-sm text-muted-foreground">HSN Codes</p>
          <p className="text-xl font-semibold mt-1">
            {new Set(products.map(p => p.hsn_code)).size}
          </p>
        </div>
      </div>
    </MainLayout>

  );
}
