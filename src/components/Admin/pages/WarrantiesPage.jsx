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
import { Warranty } from '../types/database';

export default function WarrantiesPage() {
  const { warranties, addWarranty, updateWarranty, deleteWarranty } = useData();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    warranty_id: '',
    warranty_text: '',
  });

  const openDialog = (item) => {
    if (item) {
      setEditingItem(item);
      setFormData(item);
    } else {
      setEditingItem(null);
      setFormData({ warranty_id: '', warranty_text: '' });
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = () => {
    if (!formData.warranty_id || !formData.warranty_text) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (editingItem) {
      updateWarranty(editingItem.warranty_id, formData);
      toast.success('Warranty updated');
    } else {
      if (warranties.some(w => w.warranty_id === formData.warranty_id)) {
        toast.error('Warranty ID already exists');
        return;
      }
      addWarranty(formData);
      toast.success('Warranty added');
    }
    setIsDialogOpen(false);
  };

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this warranty?')) {
      deleteWarranty(id);
      toast.success('Warranty deleted');
    }
  };

  return (
    <MainLayout>
      <PageHeader
        title="Warranties"
        description="Manage warranty options"
        action={
          <Button onClick={() => openDialog()} className="gap-2 bg-[#DB7706] hover:bg-[#DB7706] rounded-xl">
            <Plus className="h-4 w-4" />
            Add Warranty
          </Button>
        }
      />

      <div className="rounded-xl border border-border bg-card overflow-hidden max-w-2xl">
        <Table>
          <TableHeader>
            <TableRow className="table-header">
              <TableHead>Warranty ID</TableHead>
              <TableHead>Warranty Text</TableHead>
              <TableHead className="w-24">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {warranties.map((item) => (
              <TableRow key={item.warranty_id} className="animate-fade-in">
                <TableCell className="font-mono text-sm">{item.warranty_id}</TableCell>
                <TableCell className="font-medium">{item.warranty_text}</TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" onClick={() => openDialog(item)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(item.warranty_id)}>
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
            <DialogTitle>{editingItem ? 'Edit Warranty' : 'Add Warranty'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Warranty ID *</Label>
              <Input
                value={formData.warranty_id}
                onChange={(e) => setFormData({ ...formData, warranty_id: e.target.value.toUpperCase() })}
                disabled={!!editingItem}
                placeholder="e.g., W1"
              />
            </div>
            <div className="space-y-2">
              <Label>Warranty Text *</Label>
              <Input
                value={formData.warranty_text}
                onChange={(e) => setFormData({ ...formData, warranty_text: e.target.value })}
                placeholder="e.g., 5 YEARS"
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
