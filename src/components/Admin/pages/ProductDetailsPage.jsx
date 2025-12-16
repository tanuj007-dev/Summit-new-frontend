import { useState } from 'react';
import { useData } from '../../../context/DataContext';
import { MainLayout } from '../layout/MainLayout';
import { PageHeader } from '../layout/PageHeader';
import { Button } from '../layout/ui/button';
import { Input } from '../layout/ui/input';
import { Label } from '../layout/ui/label';
import { Textarea } from '../layout/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../layout/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../layout/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../layout/ui/table';
import { ScrollArea } from '../layout/ui/scroll-area';
import { Plus, Pencil, Trash2, Search, Eye } from 'lucide-react';
import { toast } from 'sonner';
import { ProductDetail } from '../types/database';

export default function ProductDetailsPage() {
  const { 
    productDetails, products, subcategories, series, materials, warranties, certifications,
    addProductDetail, updateProductDetail, deleteProductDetail 
  } = useData();
  
  const [search, setSearch] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [viewingDetail, setViewingDetail] = useState(null);
  const [editingDetail, setEditingDetail] = useState(null);
  
  const emptyForm = {
    product_id: '',
    series_id: '',
    subcat_id: '',
    material_id: '',
    warranty_id: '',
    certification_id: '',
    net_quantity: '',
    weight: '',
    mrp: '',
    item_dimensions: '',
    package_dimensions: '',
    manufacturer: '',
    marketer: '',
    contents: '',
    customer_care: '',
    description: '',
  };
  
  const [formData, setFormData] = useState(emptyForm);

  const filteredDetails = productDetails.filter(d => {
    const product = products.find(p => p.product_id === d.product_id);
    return product?.product_name.toLowerCase().includes(search.toLowerCase()) ||
      d.product_id.toLowerCase().includes(search.toLowerCase());
  });

  const openDialog = (detail) => {
    if (detail) {
      setEditingDetail(detail);
      const { detail_id, ...rest } = detail;
      setFormData(rest);
    } else {
      setEditingDetail(null);
      setFormData(emptyForm);
    }
    setIsDialogOpen(true);
  };

  const openView = (detail) => {
    setViewingDetail(detail);
    setIsViewOpen(true);
  };

  const handleSubmit = () => {
    if (!formData.product_id) {
      toast.error('Please select a product');
      return;
    }

    if (editingDetail) {
      updateProductDetail(editingDetail.detail_id, formData);
      toast.success('Product detail updated');
    } else {
      addProductDetail(formData);
      toast.success('Product detail added');
    }
    setIsDialogOpen(false);
  };

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this product detail?')) {
      deleteProductDetail(id);
      toast.success('Product detail deleted');
    }
  };

  const getProductSeriesAndSubcats = (productId) => ({
    productSeries: series.filter(s => s.product_id === productId),
    productSubcats: subcategories.filter(s => s.product_id === productId),
  });

  const { productSeries, productSubcats } = formData.product_id 
    ? getProductSeriesAndSubcats(formData.product_id) 
    : { productSeries: [], productSubcats: [] };

  return (
    <MainLayout>
      <PageHeader
        title="Product Details"
        description="Manage detailed product specifications"
        action={
          <Button onClick={() => openDialog()} className="gap-2  bg-[#DB7706] hover:bg-[#DB7706] rounded-xl">
            <Plus className="h-4 w-4" />
            Add Detail
          </Button>
        }
      />

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by product..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 
    rounded-xl 
    placeholder:text-gray-500
    focus:outline-none
    focus:ring-1
    focus:ring-gray-100
    focus:border-gray-100
    focus-visible:ring-gray-100
    focus-visible:border-gray-100"
        />
      </div>

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="table-header">
              <TableHead>ID</TableHead>
              <TableHead>Product</TableHead>
              <TableHead>Series</TableHead>
              <TableHead>Material</TableHead>
              <TableHead>MRP</TableHead>
              <TableHead>Weight</TableHead>
              <TableHead className="w-32">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredDetails.map((detail) => {
              const product = products.find(p => p.product_id === detail.product_id);
              const seriesItem = series.find(s => s.series_id === detail.series_id);
              const material = materials.find(m => m.material_id === detail.material_id);
              
              return (
                <TableRow key={detail.detail_id} className="animate-fade-in">
                  <TableCell className="font-mono text-sm">{detail.detail_id}</TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium text-sm">{product?.product_name || 'N/A'}</p>
                      <p className="text-xs text-muted-foreground">{detail.product_id}</p>
                    </div>
                  </TableCell>
                  <TableCell>{seriesItem?.series_name || 'N/A'}</TableCell>
                  <TableCell>{material?.material_name || 'N/A'}</TableCell>
                  <TableCell className="font-medium">₹{detail.mrp || '0'}</TableCell>
                  <TableCell>{detail.weight ? `${detail.weight} kg` : 'N/A'}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" onClick={() => openView(detail)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => openDialog(detail)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(detail.detail_id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
            {filteredDetails.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  No product details found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Edit/Add Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>{editingDetail ? 'Edit Product Detail' : 'Add Product Detail'}</DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-[70vh] pr-4">
            <div className="space-y-6 py-4">
              {/* Relations Section */}
              <div className="form-section">
                <h3 className="font-medium mb-4">Product Relations</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Product *</Label>
                    <Select
                      value={formData.product_id}
                      onValueChange={(value) => setFormData({ ...formData, product_id: value, series_id: '', subcat_id: '' })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select product" />
                      </SelectTrigger>
                      <SelectContent>
                        {products.map(p => (
                          <SelectItem key={p.product_id} value={p.product_id}>{p.product_name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Series</Label>
                    <Select
                      value={formData.series_id}
                      onValueChange={(value) => setFormData({ ...formData, series_id: value })}
                      disabled={!formData.product_id}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select series" />
                      </SelectTrigger>
                      <SelectContent>
                        {productSeries.map(s => (
                          <SelectItem key={s.series_id} value={s.series_id}>{s.series_name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Subcategory</Label>
                    <Select
                      value={formData.subcat_id}
                      onValueChange={(value) => setFormData({ ...formData, subcat_id: value })}
                      disabled={!formData.product_id}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select subcategory" />
                      </SelectTrigger>
                      <SelectContent>
                        {productSubcats.map(s => (
                          <SelectItem key={s.subcat_id} value={s.subcat_id}>{s.subcat_name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Material</Label>
                    <Select
                      value={formData.material_id}
                      onValueChange={(value) => setFormData({ ...formData, material_id: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select material" />
                      </SelectTrigger>
                      <SelectContent>
                        {materials.map(m => (
                          <SelectItem key={m.material_id} value={m.material_id}>{m.material_name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Warranty</Label>
                    <Select
                      value={formData.warranty_id}
                      onValueChange={(value) => setFormData({ ...formData, warranty_id: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select warranty" />
                      </SelectTrigger>
                      <SelectContent>
                        {warranties.map(w => (
                          <SelectItem key={w.warranty_id} value={w.warranty_id}>{w.warranty_text}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Certification</Label>
                    <Select
                      value={formData.certification_id}
                      onValueChange={(value) => setFormData({ ...formData, certification_id: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select certification" />
                      </SelectTrigger>
                      <SelectContent>
                        {certifications.map(c => (
                          <SelectItem key={c.cert_id} value={c.cert_id}>{c.cert_text}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Specifications Section */}
              <div className="form-section">
                <h3 className="font-medium mb-4">Specifications</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label>Net Quantity</Label>
                    <Input
                      value={formData.net_quantity}
                      onChange={(e) => setFormData({ ...formData, net_quantity: e.target.value })}
                      placeholder="e.g., 1 UNIT"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Weight (kg)</Label>
                    <Input
                      value={formData.weight}
                      onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                      placeholder="e.g., 0.75"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>MRP (₹)</Label>
                    <Input
                      value={formData.mrp}
                      onChange={(e) => setFormData({ ...formData, mrp: e.target.value })}
                      placeholder="e.g., 990"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Item Dimensions</Label>
                    <Input
                      value={formData.item_dimensions}
                      onChange={(e) => setFormData({ ...formData, item_dimensions: e.target.value })}
                      placeholder="L x W x H"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div className="space-y-2">
                    <Label>Package Dimensions</Label>
                    <Input
                      value={formData.package_dimensions}
                      onChange={(e) => setFormData({ ...formData, package_dimensions: e.target.value })}
                      placeholder="L x W x H"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Contents</Label>
                    <Input
                      value={formData.contents}
                      onChange={(e) => setFormData({ ...formData, contents: e.target.value })}
                      placeholder="What's in the box"
                    />
                  </div>
                </div>
              </div>

              {/* Business Info Section */}
              <div className="form-section">
                <h3 className="font-medium mb-4">Business Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Manufacturer</Label>
                    <Textarea
                      value={formData.manufacturer}
                      onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })}
                      placeholder="Manufacturer details"
                      rows={3}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Marketer</Label>
                    <Textarea
                      value={formData.marketer}
                      onChange={(e) => setFormData({ ...formData, marketer: e.target.value })}
                      placeholder="Marketer details"
                      rows={3}
                    />
                  </div>
                </div>
                <div className="space-y-2 mt-4">
                  <Label>Customer Care</Label>
                  <Textarea
                    value={formData.customer_care}
                    onChange={(e) => setFormData({ ...formData, customer_care: e.target.value })}
                    placeholder="Customer care contact details"
                    rows={2}
                  />
                </div>
              </div>

              {/* Description Section */}
              <div className="form-section">
                <h3 className="font-medium mb-4">Description</h3>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Full product description..."
                  rows={6}
                />
              </div>
            </div>
          </ScrollArea>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmit} className="bg-[#DB7706] hover:bg-[#DB7706] rounded-xl">{editingDetail ? 'Update' : 'Add'} Detail</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Product Detail View</DialogTitle>
          </DialogHeader>
          {viewingDetail && (
            <ScrollArea className="max-h-[70vh]">
              <div className="space-y-4 py-4">
                {Object.entries(viewingDetail).map(([key, value]) => (
                  <div key={key} className="flex border-b border-border pb-2">
                    <span className="w-40 text-sm text-muted-foreground font-medium">{key.replace(/_/g, ' ').toUpperCase()}</span>
                    <span className="flex-1 text-sm">{value || 'N/A'}</span>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
}
