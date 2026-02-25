import { useState } from 'react';
import { useData } from '../../../context/DataContext';
import { MainLayout } from '../layout/MainLayout';
import { PageHeader } from '../layout/PageHeader';
import { Button } from '../layout/ui/button';
import { Input } from '../layout/ui/input';
import { Label } from '../layout/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../layout/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../layout/ui/table';
import { Plus, Pencil, Trash2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Material } from '../types/database';

export default function MaterialsPage() {
  const { materials, addMaterial, updateMaterial, deleteMaterial, isLoadingMaterials } = useData();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    material_id: '',
    material_name: '',
  });

  const openDialog = (item) => {
    if (item) {
      setEditingItem(item);
      setFormData(item);
    } else {
      setEditingItem(null);
      setFormData({ material_id: '', material_name: '' });
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = async () => {
    if (!formData.material_id || !formData.material_name) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setIsSubmitting(true);
      if (editingItem) {
        await updateMaterial(editingItem.material_id, formData);
        toast.success('Material updated successfully');
      } else {
        if (materials.some(m => m.material_id === formData.material_id)) {
          toast.error('Material ID already exists');
          return;
        }
        await addMaterial(formData);
        toast.success('Material added successfully');
      }
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error:', error);
      toast.error(error.response?.data?.message || (editingItem ? 'Failed to update material' : 'Failed to add material'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this material?')) {
      try {
        await deleteMaterial(id);
        toast.success('Material deleted successfully');
      } catch (error) {
        console.error('Error:', error);
        toast.error('Failed to delete material');
      }
    }
  };

  return (
    <MainLayout>
      <PageHeader
        title="Materials"
        description="Manage product materials"
        action={
          <Button onClick={() => openDialog()} className="gap-2 bg-[#DB7706] hover:bg-[#DB7706] rounded-xl" disabled={isSubmitting}>
            <Plus className="h-4 w-4" />
            Add Material
          </Button>
        }
      />

      <div className="rounded-xl border border-border bg-card overflow-hidden max-w-2xl">
        {isLoadingMaterials ? (
          <div className="flex items-center justify-center h-64">
            <div className="flex items-center gap-2">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Loading materials...</span>
            </div>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="table-header">
                <TableHead>Material ID</TableHead>
                <TableHead>Material Name</TableHead>
                <TableHead className="w-24">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {materials && materials.length > 0 ? (
                materials.map((item) => (
                  <TableRow key={item.material_id} className="animate-fade-in">
                    <TableCell className="font-mono text-sm">{item.material_id}</TableCell>
                    <TableCell className="font-medium">{item.material_name}</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" onClick={() => openDialog(item)} disabled={isSubmitting}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(item.material_id)} disabled={isSubmitting}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan="3" className="text-center py-8 text-muted-foreground">
                    No materials found
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
            <DialogTitle>{editingItem ? 'Edit Material' : 'Add Material'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Material ID *</Label>
              <Input
                value={formData.material_id}
                onChange={(e) => setFormData({ ...formData, material_id: e.target.value.toUpperCase() })}
                disabled={!!editingItem || isSubmitting}
                placeholder="e.g., M1"
              />
            </div>
            <div className="space-y-2">
              <Label>Material Name *</Label>
              <Input
                value={formData.material_name}
                onChange={(e) => setFormData({ ...formData, material_name: e.target.value })}
                disabled={isSubmitting}
                placeholder="e.g., Aluminium"
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
