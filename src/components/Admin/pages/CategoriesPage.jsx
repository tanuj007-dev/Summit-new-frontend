import { useState } from 'react';
import { useData } from '../../../context/DataContext';
import { MainLayout } from '../layout/MainLayout';
import { PageHeader } from '../layout/PageHeader';
import { Button } from '../layout/ui/button';
import { Input } from '../layout/ui/input';
import { Label } from '../layout/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../layout/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../layout/ui/table';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Category } from '../types/database';

export default function CategoriesPage() {
  const { categories, products, addCategory, updateCategory, deleteCategory } = useData();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    category_id: '',
    category_name: '',
    sort_order: 10,
  });

  const sortedCategories = [...categories].sort((a, b) => a.sort_order - b.sort_order);

  const openDialog = (item) => {
    if (item) {
      setEditingItem(item);
      setFormData(item);
    } else {
      setEditingItem(null);
      const maxOrder = Math.max(...categories.map(c => c.sort_order), 0);
      setFormData({ category_id: '', category_name: '', sort_order: maxOrder + 10 });
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = () => {
    if (!formData.category_id || !formData.category_name) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (editingItem) {
      updateCategory(editingItem.category_id, formData);
      toast.success('Category updated');
    } else {
      if (categories.some(c => c.category_id === formData.category_id)) {
        toast.error('Category ID already exists');
        return;
      }
      addCategory(formData);
      toast.success('Category added');
    }
    setIsDialogOpen(false);
  };

  const handleDelete = (id) => {
    const hasProducts = products.some(p => p.category_id === id);
    if (hasProducts) {
      toast.error('Cannot delete category with associated products');
      return;
    }
    if (confirm('Are you sure you want to delete this category?')) {
      deleteCategory(id);
      toast.success('Category deleted');
    }
  };

  return (
    <MainLayout>
      <PageHeader
        title="Categories"
        description="Manage product categories"
        action={
          <Button onClick={() => openDialog()} className="gap-2  bg-[#DB7706] hover:bg-[#DB7706] rounded-xl">
            <Plus className="h-4 w-4" />
            Add Category
          </Button>
        }
      />

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="table-header">
              <TableHead>Category ID</TableHead>
              <TableHead>Category Name</TableHead>
              <TableHead>Sort Order</TableHead>
              <TableHead>Products</TableHead>
              <TableHead className="w-24">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedCategories.map((item) => {
              const productCount = products.filter(p => p.category_id === item.category_id).length;
              return (
                <TableRow key={item.category_id} className="animate-fade-in">
                  <TableCell className="font-mono text-sm">{item.category_id}</TableCell>
                  <TableCell className="font-medium">{item.category_name}</TableCell>
                  <TableCell>{item.sort_order}</TableCell>
                  <TableCell>
                    <span className="px-2 py-1 text-xs rounded-full bg-[#FEF1E1] text-[#955104]">
                      {productCount}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" onClick={() => openDialog(item)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(item.category_id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingItem ? 'Edit Category' : 'Add Category'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Category ID *</Label>
              <Input
                value={formData.category_id}
                onChange={(e) => setFormData({ ...formData, category_id: e.target.value.toUpperCase() })}
                disabled={!!editingItem}
                placeholder="e.g., PC"
              />
            </div>
            <div className="space-y-2">
              <Label>Category Name *</Label>
              <Input
                value={formData.category_name}
                onChange={(e) => setFormData({ ...formData, category_name: e.target.value })}
                placeholder="e.g., Pressure Cooker"
              />
            </div>
            <div className="space-y-2">
              <Label>Sort Order</Label>
              <Input
                type="number"
                value={formData.sort_order}
                onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) || 0 })}
                placeholder="10"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmit} className="bg-[#DB7706] hover:bg-[#DB7706] rounded-xl">{editingItem ? 'Update' : 'Add'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
}
