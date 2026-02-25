import { useState } from 'react';
import { useData } from '../../../context/DataContext';
import { MainLayout } from '../layout/MainLayout';
import { PageHeader } from '../layout/PageHeader';
import { Button } from '../layout/ui/button';
import { Input } from '../layout/ui/input';
import { Label } from '../layout/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../layout/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../layout/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../layout/ui/table';
import { Checkbox } from '../layout/ui/checkbox';
import { Plus, Pencil, Trash2, Search, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Product } from '../types/database';

export default function ProductsPage() {
  const { products, isLoadingProducts, categories, addProduct, updateProduct, deleteProduct } = useData();
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    product_id: '',
    product_name: '',
    hsn_code: '',
    tax_rate: 0.05,
    category_id: '',
    trending_flag: 0,
  });

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.product_name.toLowerCase().includes(search.toLowerCase()) ||
                         product.product_id.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || product.category_id === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const openDialog = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        product_id: product.product_id,
        product_name: product.product_name,
        hsn_code: product.hsn_code || '',
        tax_rate: product.tax_rate || 0.05,
        category_id: product.category_id,
        trending_flag: product.trending_flag === 1 || product.trending_flag === true ? 1 : 0,
      });
    } else {
      setEditingProduct(null);
      setFormData({
        product_id: '',
        product_name: '',
        hsn_code: '',
        tax_rate: 0.05,
        category_id: '',
        trending_flag: 0,
      });
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e) => {
    if (e?.preventDefault) e.preventDefault();
    if (!formData.product_id?.trim() || !formData.product_name?.trim() || !formData.category_id) {
      const missing = [];
      if (!formData.product_id?.trim()) missing.push('Product ID');
      if (!formData.product_name?.trim()) missing.push('Product Name');
      if (!formData.category_id) missing.push('Category');
      toast.error(`Please fill in all required fields: ${missing.join(', ')}`);
      return;
    }
    if (!editingProduct && products.some(p => p.product_id === formData.product_id.trim())) {
      toast.error('Product ID already exists');
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingProduct) {
        await updateProduct(editingProduct.product_id, formData);
        toast.success('Product updated successfully');
      } else {
        await addProduct({
          ...formData,
          product_id: formData.product_id.trim(),
          product_name: formData.product_name.trim(),
          trending_flag: formData.trending_flag ? 1 : 0,
        });
        toast.success('Product added successfully');
      }
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Submit error:', error);
      toast.error(error.response?.data?.message || error.message || 'Failed to save product');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleTrending = async (product) => {
    const newFlag = product.trending_flag === 1 || product.trending_flag === true ? 0 : 1;
    try {
      await updateProduct(product.product_id, {
        product_name: product.product_name,
        trending_flag: newFlag,
      });
      toast.success(newFlag ? 'Added to Trending section' : 'Removed from Trending section');
    } catch (error) {
      console.error('Toggle trending error:', error);
      toast.error(error.response?.data?.message || error.message || 'Failed to update trending');
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct(id);
        toast.success('Product deleted');
      } catch (error) {
        console.error('Delete error:', error);
        toast.error(error.response?.data?.message || error.message || 'Failed to delete product');
      }
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <PageHeader
          title="Products"
          description="Manage your product catalog"
          action={
            <Button onClick={() => openDialog()} className="gap-2">
              <Plus className="h-4 w-4" />
              Add Product
            </Button>
          }
        />

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map(cat => (
                <SelectItem
                  key={cat.category_id}
                  value={cat.category_id}
                  className="
                    cursor-pointer
                    hover:bg-[#FEF1E1]
                    focus:bg-[#FEF1E1]
                    data-[state=checked]:bg-[#FEF1E1]
                    data-[state=checked]:text-[#955104]
                  "
                >
                  {cat.category_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          {isLoadingProducts ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-[#DB7706]" />
              <span className="ml-2">Loading products...</span>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="flex items-center justify-center py-8 text-muted-foreground">
              No products found
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="table-header">
                  <TableHead>Product ID</TableHead>
                  <TableHead>Product Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>HSN Code</TableHead>
                  <TableHead>Tax Rate</TableHead>
                  <TableHead className="w-20 text-center">Trending</TableHead>
                  <TableHead className="w-24">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product) => {
                  const category = categories.find(c => c.category_id === product.category_id);
                  return (
                    <TableRow key={product.product_id} className="animate-fade-in">
                      <TableCell className="font-mono text-sm">{product.product_id}</TableCell>
                      <TableCell className="font-medium">{product.product_name}</TableCell>
                      <TableCell>
                        <span className="px-2 py-1 text-xs rounded-full bg-[#FEF1E1] text-[#955104]">
                          {category?.category_name || 'N/A'}
                        </span>
                      </TableCell>
                      <TableCell className="font-mono text-sm">{product.hsn_code}</TableCell>
                      <TableCell>{(product.tax_rate * 100).toFixed(0)}%</TableCell>
                      <TableCell className="text-center">
                        <Checkbox
                          checked={product.trending_flag === 1 || product.trending_flag === true}
                          onCheckedChange={() => handleToggleTrending(product)}
                          aria-label="Show in Trending section"
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="icon" onClick={() => openDialog(product)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleDelete(product.product_id)}
                            disabled={isSubmitting}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </div>

        {/* Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>{editingProduct ? 'Edit Product' : 'Add New Product'}</DialogTitle>
            </DialogHeader>
            <form
              id="product-form"
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmit(e);
              }}
              className="space-y-4 py-4"
            >
              <div className="space-y-2">
                <Label htmlFor="product_id">Product ID *</Label>
                <Input
                  id="product_id"
                  value={formData.product_id}
                  onChange={(e) => setFormData({ ...formData, product_id: e.target.value })}
                  disabled={!!editingProduct}
                  placeholder="e.g., SI1F"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="product_name">Product Name *</Label>
                <Input
                  id="product_name"
                  value={formData.product_name}
                  onChange={(e) => setFormData({ ...formData, product_name: e.target.value })}
                  placeholder="e.g., SUMMIT INNERLID 1L PLAIN FINE"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category_id">Category *</Label>
                <Select
                  value={formData.category_id}
                  onValueChange={(value) => setFormData({ ...formData, category_id: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(cat => (
                      <SelectItem key={cat.category_id} value={cat.category_id}>
                        {cat.category_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="hsn_code">HSN Code</Label>
                  <Input
                    id="hsn_code"
                    value={formData.hsn_code}
                    onChange={(e) => setFormData({ ...formData, hsn_code: e.target.value })}
                    placeholder="761510"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tax_rate">Tax Rate (%)</Label>
                  <Input
                    id="tax_rate"
                    type="number"
                    step="0.01"
                    value={(formData.tax_rate || 0) * 100}
                    onChange={(e) => setFormData({ ...formData, tax_rate: parseFloat(e.target.value) / 100 })}
                    placeholder="5"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="trending_flag"
                    checked={formData.trending_flag === 1}
                    onCheckedChange={(checked) => setFormData({ ...formData, trending_flag: checked ? 1 : 0 })}
                  />
                  <Label htmlFor="trending_flag" className="text-sm font-medium cursor-pointer">
                    Show in Trending section (homepage)
                  </Label>
                </div>
                <p className="text-xs text-muted-foreground pl-6">
                  When checked, this product appears in &quot;Trending Kitchen Essentials&quot; on the main site.
                </p>
              </div>
            </form>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" form="product-form" disabled={isSubmitting} className="gap-2">
                {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                {editingProduct ? 'Update Product' : 'Add Product'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
}
