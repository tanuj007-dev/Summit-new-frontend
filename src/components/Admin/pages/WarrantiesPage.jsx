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
import { Warranty } from '../types/database';

export default function WarrantiesPage() {
  const { warranties, addWarranty, updateWarranty, deleteWarranty, isLoadingWarranties } = useData();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  const handleSubmit = async () => {
    if (!formData.warranty_id || !formData.warranty_text) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setIsSubmitting(true);
      if (editingItem) {
        await updateWarranty(editingItem.warranty_id, formData);
        toast.success('Warranty updated successfully');
      } else {
        if (warranties.some(w => w.warranty_id === formData.warranty_id)) {
          toast.error('Warranty ID already exists');
          return;
        }
        await addWarranty(formData);
        toast.success('Warranty added successfully');
      }
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error:', error);
      toast.error(error.response?.data?.message || (editingItem ? 'Failed to update warranty' : 'Failed to add warranty'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this warranty?')) {
      try {
        await deleteWarranty(id);
        toast.success('Warranty deleted successfully');
      } catch (error) {
        console.error('Error:', error);
        toast.error('Failed to delete warranty');
      }
    }
  };

  return (
    <MainLayout>
      <PageHeader
        title="Warranties"
        description="Manage warranty options"
        action={
          <Button onClick={() => openDialog()} className="gap-2 bg-[#DB7706] hover:bg-[#DB7706] rounded-xl" disabled={isSubmitting}>
            <Plus className="h-4 w-4" />
            Add Warranty
          </Button>
        }
      />

      <div className="rounded-xl border border-border bg-card overflow-hidden max-w-2xl">
        {isLoadingWarranties ? (
          <div className="flex items-center justify-center h-64">
            <div className="flex items-center gap-2">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Loading warranties...</span>
            </div>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="table-header">
                <TableHead>Warranty ID</TableHead>
                <TableHead>Warranty Text</TableHead>
                <TableHead className="w-24">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {warranties && warranties.length > 0 ? (
                warranties.map((item) => (
                  <TableRow key={item.warranty_id} className="animate-fade-in">
                    <TableCell className="font-mono text-sm">{item.warranty_id}</TableCell>
                    <TableCell className="font-medium">{item.warranty_text}</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" onClick={() => openDialog(item)} disabled={isSubmitting}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(item.warranty_id)} disabled={isSubmitting}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan="3" className="text-center py-8 text-muted-foreground">
                    No warranties found
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
            <DialogTitle>{editingItem ? 'Edit Warranty' : 'Add Warranty'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Warranty ID *</Label>
              <Input
                value={formData.warranty_id}
                onChange={(e) => setFormData({ ...formData, warranty_id: e.target.value.toUpperCase() })}
                disabled={!!editingItem || isSubmitting}
                placeholder="e.g., W1"
              />
            </div>
            <div className="space-y-2">
              <Label>Warranty Text *</Label>
              <Input
                value={formData.warranty_text}
                onChange={(e) => setFormData({ ...formData, warranty_text: e.target.value })}
                disabled={isSubmitting}
                placeholder="e.g., 5 YEARS"
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
