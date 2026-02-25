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
import { Plus, Pencil, Trash2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Subcategory } from '../types/database';

export default function SubcategoriesPage() {
  const { subcategories, products, addSubcategory, updateSubcategory, deleteSubcategory, isLoadingSubcategories } = useData();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    subcat_id: '',
    product_id: '',
    subcat_name: '',
  });

  const openDialog = (item) => {
    if (item) {
      setEditingItem(item);
      setFormData(item);
    } else {
      setEditingItem(null);
      setFormData({ subcat_id: '', product_id: '', subcat_name: '' });
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = async () => {
    if (!formData.subcat_id || !formData.product_id || !formData.subcat_name) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setIsSubmitting(true);
      if (editingItem) {
        await updateSubcategory(editingItem.subcat_id, formData);
        toast.success('Subcategory updated successfully');
      } else {
        if (subcategories.some(s => s.subcat_id === formData.subcat_id)) {
          toast.error('Subcategory ID already exists');
          return;
        }
        await addSubcategory(formData);
        toast.success('Subcategory added successfully');
      }
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error:', error);
      toast.error(error.response?.data?.message || (editingItem ? 'Failed to update subcategory' : 'Failed to add subcategory'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this subcategory?')) {
      try {
        await deleteSubcategory(id);
        toast.success('Subcategory deleted successfully');
      } catch (error) {
        console.error('Error:', error);
        toast.error('Failed to delete subcategory');
      }
    }
  };

  return (
    <MainLayout>
      <PageHeader
        title="Subcategories"
        description="Manage product subcategories"
        action={
          <Button onClick={() => openDialog()} className="gap-2 bg-[#DB7706] hover:bg-[#DB7706] rounded-xl" disabled={isSubmitting}>
            <Plus className="h-4 w-4" />
            Add Subcategory
          </Button>
        }
      />

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        {isLoadingSubcategories ? (
          <div className="flex items-center justify-center h-64">
            <div className="flex items-center gap-2">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Loading subcategories...</span>
            </div>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="table-header">
                <TableHead>Subcat ID</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Subcategory Name</TableHead>
                <TableHead className="w-24">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {subcategories && subcategories.length > 0 ? (
                subcategories.map((item) => {
                  const product = products.find(p => p.product_id === item.product_id);
                  return (
                    <TableRow key={item.subcat_id} className="animate-fade-in">
                      <TableCell className="font-mono text-sm">{item.subcat_id}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium text-sm">{product?.product_name || 'N/A'}</p>
                          <p className="text-xs text-muted-foreground">{item.product_id}</p>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{item.subcat_name}</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="icon" onClick={() => openDialog(item)} disabled={isSubmitting}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDelete(item.subcat_id)} disabled={isSubmitting}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan="4" className="text-center py-8 text-muted-foreground">
                    No subcategories found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}

      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingItem ? 'Edit Subcategory' : 'Add Subcategory'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Subcategory ID *</Label>
              <Input
                value={formData.subcat_id}
                onChange={(e) => setFormData({ ...formData, subcat_id: e.target.value })}
                disabled={!!editingItem || isSubmitting}
                placeholder="e.g., SI1F-SUB"
              />
            </div>
            <div className="space-y-2">
              <Label>Product *</Label>
              <Select
                value={formData.product_id}
                onValueChange={(value) => setFormData({ ...formData, product_id: value })}
                disabled={isSubmitting}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select product" />
                </SelectTrigger>
                <SelectContent>
                  {products && products.length > 0 ? (
                    products.map(p => (
                      <SelectItem key={p.product_id} value={p.product_id}>{p.product_name}</SelectItem>
                    ))
                  ) : (
                    <SelectItem disabled value="">No products available</SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Subcategory Name *</Label>
              <Input
                value={formData.subcat_name}
                onChange={(e) => setFormData({ ...formData, subcat_name: e.target.value })}
                disabled={isSubmitting}
                placeholder="e.g., Innerlid Pressure Cooker"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit} 
              className="bg-[#DB7706] hover:bg-[#DB7706] rounded-xl"
              disabled={isSubmitting}
            >
              {isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {editingItem ? 'Update' : 'Add'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
}
