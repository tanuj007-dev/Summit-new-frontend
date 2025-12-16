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
import { Material } from '../types/database';

export default function MaterialsPage() {
  const { materials, addMaterial, updateMaterial, deleteMaterial } = useData();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
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

  const handleSubmit = () => {
    if (!formData.material_id || !formData.material_name) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (editingItem) {
      updateMaterial(editingItem.material_id, formData);
      toast.success('Material updated');
    } else {
      if (materials.some(m => m.material_id === formData.material_id)) {
        toast.error('Material ID already exists');
        return;
      }
      addMaterial(formData);
      toast.success('Material added');
    }
    setIsDialogOpen(false);
  };

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this material?')) {
      deleteMaterial(id);
      toast.success('Material deleted');
    }
  };

  return (
    <MainLayout>
      <PageHeader
        title="Materials"
        description="Manage product materials"
        action={
          <Button onClick={() => openDialog()} className="gap-2 bg-[#DB7706] hover:bg-[#DB7706] rounded-xl">
            <Plus className="h-4 w-4" />
            Add Material
          </Button>
        }
      />

      <div className="rounded-xl border border-border bg-card overflow-hidden max-w-2xl">
        <Table>
          <TableHeader>
            <TableRow className="table-header">
              <TableHead>Material ID</TableHead>
              <TableHead>Material Name</TableHead>
              <TableHead className="w-24">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {materials.map((item) => (
              <TableRow key={item.material_id} className="animate-fade-in">
                <TableCell className="font-mono text-sm">{item.material_id}</TableCell>
                <TableCell className="font-medium">{item.material_name}</TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" onClick={() => openDialog(item)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(item.material_id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
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
                disabled={!!editingItem}
                placeholder="e.g., M1"
              />
            </div>
            <div className="space-y-2">
              <Label>Material Name *</Label>
              <Input
                value={formData.material_name}
                onChange={(e) => setFormData({ ...formData, material_name: e.target.value })}
                placeholder="e.g., Aluminium"
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
