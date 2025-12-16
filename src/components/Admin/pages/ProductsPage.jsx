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
import { Plus, Pencil, Trash2, Search } from 'lucide-react';
import { toast } from 'sonner';
import { Product } from '../types/database';

export default function ProductsPage() {
  const { products, categories, addProduct, updateProduct, deleteProduct } = useData();
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    product_id: '',
    product_name: '',
    hsn_code: '',
    tax_rate: 0.05,
    category_id: '',
  });

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.product_name.toLowerCase().includes(search.toLowerCase()) ||
      p.product_id.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || p.category_id === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const openDialog = (product) => {
    if (product) {
      setEditingProduct(product);
      setFormData(product);
    } else {
      setEditingProduct(null);
      setFormData({ product_id: '', product_name: '', hsn_code: '761510', tax_rate: 0.05, category_id: '' });
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = () => {
    if (!formData.product_id || !formData.product_name || !formData.category_id) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (editingProduct) {
      updateProduct(editingProduct.product_id, formData);
      toast.success('Product updated successfully');
    } else {
      if (products.some(p => p.product_id === formData.product_id)) {
        toast.error('Product ID already exists');
        return;
      }
      addProduct(formData);
      toast.success('Product added successfully');
    }
    setIsDialogOpen(false);
  };

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this product?')) {
      deleteProduct(id);
      toast.success('Product deleted');
    }
  };

  return (
    <MainLayout>
      <PageHeader
        title="Products"
        description="Manage your main product catalog"
        action={
          <Button onClick={() => openDialog()} className="gap-2 bg-[#DB7706] hover:bg-[#DB7706] rounded-xl">
            <Plus className="h-4 w-4 bg-[#DB7706]" />
            Add Product
          </Button>
        }
      />

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1 ">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4  text-muted-foreground" />
          <Input
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className=" pl-9 
    rounded-xl 
    placeholder:text-gray-500
    focus:outline-none
    focus:ring-1
    focus:ring-gray-100
    focus:border-gray-100
    focus-visible:ring-[#DB7706]
    focus-visible:border-gray-100"
          />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-full sm:w-48 rounded-xl  focus:outline-none
    focus:ring-1
    focus:ring-gray-100
    focus:border-gray-100
    focus-visible:ring-[#DB7706]
    focus-visible:border-gray-100 ]">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
         <SelectContent>
  <SelectItem
    value="all"
    className="
      cursor-pointer
      hover:bg-[#FEF1E1]
      focus:bg-[#FEF1E1]
      data-[state=checked]:bg-[#FEF1E1]
      data-[state=checked]:text-[#955104]
    "
  >
    All Categories
  </SelectItem>

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
        <Table>
          <TableHeader>
            <TableRow className="table-header">
              <TableHead>Product ID</TableHead>
              <TableHead>Product Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>HSN Code</TableHead>
              <TableHead>Tax Rate</TableHead>
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
                  <TableCell>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" onClick={() => openDialog(product)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(product.product_id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
            {filteredProducts.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  No products found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingProduct ? 'Edit Product' : 'Add New Product'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
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
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmit} className="bg-[#DB7706] hover:bg-[#DB7706] rounded-xl">{editingProduct ? 'Update' : 'Add'} Product</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
}
