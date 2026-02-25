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
import { Plus, Pencil, Trash2, Search, Eye, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { ProductDetail } from '../types/database';

export default function ProductDetailsPage() {
  const {
    productDetails, isLoadingProductDetails, products, subcategories, series, materials, warranties, certifications,
    addProductDetail, updateProductDetail, deleteProductDetail
  } = useData();

  const [search, setSearch] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [viewingDetail, setViewingDetail] = useState(null);
  const [editingDetail, setEditingDetail] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [productSearch, setProductSearch] = useState('');
  const [showProductSuggestions, setShowProductSuggestions] = useState(false);

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
    image_url: '',
    description: '',
  };

  const [formData, setFormData] = useState(emptyForm);

  const filteredDetails = productDetails.filter(d => {
    const product = products.find(p => p.product_id === d.product_id);
    return product?.product_name.toLowerCase().includes(search.toLowerCase()) ||
      d.product_id.toLowerCase().includes(search.toLowerCase());
  });

  const getProductSeriesAndSubcats = (productId) => ({
    productSeries: series.filter(s => s.product_id === productId),
    productSubcats: subcategories.filter(s => s.product_id === productId),
  });

  const { productSeries, productSubcats } = formData.product_id
    ? getProductSeriesAndSubcats(formData.product_id)
    : { productSeries: [], productSubcats: [] };

  const filteredProducts = products.filter(p =>
    p.product_name.toLowerCase().includes(productSearch.toLowerCase()) ||
    p.product_id.toLowerCase().includes(productSearch.toLowerCase())
  );

  const handleProductSelect = (productId) => {
    const selected = products.find(p => p.product_id === productId);
    setFormData({
      ...formData,
      product_id: productId,
      series_id: '',
      subcat_id: ''
    });
    setProductSearch(selected?.product_name || '');
    setShowProductSuggestions(false);
  };

  const openDialog = (detail) => {
    if (detail) {
      setEditingDetail(detail);
      const { detail_id, ...rest } = detail;
      setFormData(rest);
      setProductSearch(detail.product_id);
    } else {
      setEditingDetail(null);
      setFormData(emptyForm);
      setProductSearch('');
    }
    setIsDialogOpen(true);
  };

  const openView = (detail) => {
    setViewingDetail(detail);
    setIsViewOpen(true);
  };

  const handleSubmit = async () => {
    if (!formData.product_id) {
      toast.error('Please select a product');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        ...formData,
        image_url: formData.image_url?.trim() || null,
        image: formData.image_url?.trim() || null,
      };

      console.log('Sending payload:', payload);

      if (editingDetail) {
        await updateProductDetail(editingDetail.detail_id, payload);
        toast.success('Product detail updated');
      } else {
        // Check for duplicate product
        if (productDetails.some(d => d.product_id === formData.product_id)) {
          toast.error('This product is already uploaded or added');
          setIsSubmitting(false);
          return;
        }
        await addProductDetail(payload);
        toast.success('Product detail added');
      }
      setIsDialogOpen(false);
      setFormData(emptyForm);
      setProductSearch('');
    } catch (error) {
      console.error('Submit error:', error);
      console.error('Error response:', error.response?.data);
      toast.error(error.response?.data?.message || error.message || 'Failed to save product detail');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this product detail?')) {
      try {
        await deleteProductDetail(id);
        toast.success('Product detail deleted');
      } catch (error) {
        console.error('Delete error:', error);
        toast.error(error.response?.data?.message || error.message || 'Failed to delete product detail');
      }
    }
  };

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
          className="pl-9 rounded-xl placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-100 focus:border-gray-100 focus-visible:ring-gray-100 focus-visible:border-gray-100"
        />
      </div>

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        {isLoadingProductDetails ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-[#DB7706]" />
            <span className="ml-2">Loading product details...</span>
          </div>
        ) : filteredDetails.length === 0 ? (
          <div className="flex items-center justify-center py-8 text-muted-foreground">
            No product details found
          </div>
        ) : (
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
            </TableBody>
          </Table>
        )}
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
                    <div className="relative">
                      <Input
                        placeholder="Search and select product..."
                        value={productSearch}
                        onChange={(e) => {
                          setProductSearch(e.target.value);
                          setShowProductSuggestions(true);
                        }}
                        onFocus={() => setShowProductSuggestions(true)}
                        className="rounded-lg placeholder:text-gray-400"
                      />
                      {showProductSuggestions && productSearch && (
                        <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-lg shadow-lg z-50 max-h-48 overflow-y-auto">
                          {filteredProducts.length > 0 ? (
                            filteredProducts.map(p => (
                              <button
                                key={p.product_id}
                                type="button"
                                onClick={() => handleProductSelect(p.product_id)}
                                className="w-full text-left px-4 py-2 hover:bg-muted focus:outline-none transition-colors border-b border-border last:border-b-0"
                              >
                                <div className="font-medium text-sm">{p.product_name}</div>
                                <div className="text-xs text-muted-foreground">{p.product_id}</div>
                              </button>
                            ))
                          ) : (
                            <div className="px-4 py-2 text-sm text-muted-foreground">No products found</div>
                          )}
                        </div>
                      )}
                      {formData.product_id && (
                        <div className="mt-2 p-2 bg-muted rounded text-sm">
                          <span className="font-medium">Selected: </span>
                          {products.find(p => p.product_id === formData.product_id)?.product_name}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Series</Label>
                    <Select
                      value={formData.series_id}
                      onValueChange={(value) => setFormData({ ...formData, series_id: value })}
                      disabled={!formData.product_id}
                    >
                      <SelectTrigger className="placeholder:text-gray-400">
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
                      <SelectTrigger className="placeholder:text-gray-400">
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
                      <SelectTrigger className="placeholder:text-gray-400">
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
                      <SelectTrigger className="placeholder:text-gray-400">
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
                      <SelectTrigger className="placeholder:text-gray-400">
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
                      className="placeholder:text-gray-400"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Weight (kg)</Label>
                    <Input
                      value={formData.weight}
                      onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                      placeholder="e.g., 0.75"
                      className="placeholder:text-gray-400"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>MRP (₹)</Label>
                    <Input
                      value={formData.mrp}
                      onChange={(e) => setFormData({ ...formData, mrp: e.target.value })}
                      placeholder="e.g., 990"
                      className="placeholder:text-gray-400"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Item Dimensions</Label>
                    <Input
                      value={formData.item_dimensions}
                      onChange={(e) => setFormData({ ...formData, item_dimensions: e.target.value })}
                      placeholder="L x W x H"
                      className="placeholder:text-gray-400"
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
                      className="placeholder:text-gray-400"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Contents</Label>
                    <Input
                      value={formData.contents}
                      onChange={(e) => setFormData({ ...formData, contents: e.target.value })}
                      placeholder="What's in the box"
                      className="placeholder:text-gray-400"
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
                      className="placeholder:text-gray-400"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Marketer</Label>
                    <Textarea
                      value={formData.marketer}
                      onChange={(e) => setFormData({ ...formData, marketer: e.target.value })}
                      placeholder="Marketer details"
                      rows={3}
                      className="placeholder:text-gray-400"
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
                    className="placeholder:text-gray-400"
                  />
                </div>
              </div>

              {/* Image Section */}
              <div className="form-section">
                <h3 className="font-medium mb-4">Product Image</h3>
                <div className="space-y-2">
                  <Label htmlFor="image_url">S3 Image URL (URI)</Label>
                  <Input
                    id="image_url"
                    value={formData.image_url}
                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                    placeholder="s3://your-bucket/path/to/image.jpg"
                    className="placeholder:text-gray-400"
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
                  className="placeholder:text-gray-400"
                />
              </div>
            </div>
          </ScrollArea>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isSubmitting}>Cancel</Button>
            <Button onClick={handleSubmit} disabled={isSubmitting} className="bg-[#DB7706] hover:bg-[#DB7706] rounded-xl">
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {editingDetail ? 'Updating...' : 'Adding...'}
                </>
              ) : (
                editingDetail ? 'Update' : 'Add'
              )}
            </Button>
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
            <ScrollArea className="max-h-[70vh] w-full">
              <div className="space-y-4 py-4 px-4">
                {/* Image Preview */}
                {viewingDetail.image_url && (
                  <div className="mb-6 p-4 bg-muted rounded-lg">
                    <h4 className="text-sm font-medium mb-3">Product Image</h4>
                    <img
                      src={
                        viewingDetail.image_url.startsWith('s3://')
                          ? viewingDetail.image_url.replace('s3://', 'https://').replace(/([^/]+)\//, '$1.s3.amazonaws.com/')
                          : viewingDetail.image_url
                      }
                      alt="Product"
                      className="max-w-full h-auto max-h-64 rounded"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  </div>
                )}
                {/* Details List */}
                <div className="space-y-3">
                  <h4 className="text-sm font-medium">Details</h4>
                  {Object.entries(viewingDetail).map(([key, value]) => {
                    if (key === 'image_url') return null;

                    return (
                      <div key={key} className="grid grid-cols-3 gap-4 border-b border-border pb-2">
                        <span className="text-sm font-medium text-muted-foreground">{key.replace(/_/g, ' ').toUpperCase()}</span>
                        <span className="col-span-2 text-sm break-words">{value ? String(value) : 'N/A'}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </ScrollArea>
          )}
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
}
