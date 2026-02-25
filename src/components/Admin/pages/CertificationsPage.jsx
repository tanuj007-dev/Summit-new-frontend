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
import { Certification } from '../types/database';

export default function CertificationsPage() {
  const { certifications, isLoadingCertifications, addCertification, updateCertification, deleteCertification } = useData();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    cert_id: '',
    cert_text: '',
  });

  const openDialog = (item) => {
    if (item) {
      setEditingItem(item);
      setFormData(item);
    } else {
      setEditingItem(null);
      setFormData({ cert_id: '', cert_text: '' });
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = async () => {
    if (!formData.cert_id || !formData.cert_text) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingItem) {
        await updateCertification(editingItem.cert_id, formData);
        toast.success('Certification updated');
      } else {
        if (certifications.some(c => c.cert_id === formData.cert_id)) {
          toast.error('Certification ID already exists');
          return;
        }
        await addCertification(formData);
        toast.success('Certification added');
      }
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Submit error:', error);
      toast.error(error.response?.data?.message || error.message || 'Failed to save certification');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this certification?')) {
      try {
        await deleteCertification(id);
        toast.success('Certification deleted');
      } catch (error) {
        console.error('Delete error:', error);
        toast.error(error.response?.data?.message || error.message || 'Failed to delete certification');
      }
    }
  };

  return (
    <MainLayout>
      <PageHeader
        title="Certifications"
        description="Manage certification options"
        action={
          <Button onClick={() => openDialog()} className="gap-2 bg-[#DB7706] hover:bg-[#DB7706] rounded-xl">
            <Plus className="h-4 w-4" />
            Add Certification
          </Button>
        }
      />

      <div className="rounded-xl border border-border bg-card overflow-hidden max-w-2xl">
        {isLoadingCertifications ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-[#DB7706]" />
            <span className="ml-2">Loading certifications...</span>
          </div>
        ) : certifications.length === 0 ? (
          <div className="flex items-center justify-center py-8 text-muted-foreground">
            No certifications found
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="table-header">
                <TableHead>Cert ID</TableHead>
                <TableHead>Certification Text</TableHead>
                <TableHead className="w-24">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {certifications.map((item) => (
                <TableRow key={item.cert_id} className="animate-fade-in">
                  <TableCell className="font-mono text-sm">{item.cert_id}</TableCell>
                  <TableCell className="font-medium">{item.cert_text}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" onClick={() => openDialog(item)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(item.cert_id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingItem ? 'Edit Certification' : 'Add Certification'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Certification ID *</Label>
              <Input
                value={formData.cert_id}
                onChange={(e) => setFormData({ ...formData, cert_id: e.target.value.toUpperCase() })}
                disabled={!!editingItem}
                placeholder="e.g., C1"
              />
            </div>
            <div className="space-y-2">
              <Label>Certification Text *</Label>
              <Input
                value={formData.cert_text}
                onChange={(e) => setFormData({ ...formData, cert_text: e.target.value })}
                placeholder="e.g., ISI CERTIFIED"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isSubmitting}>Cancel</Button>
            <Button onClick={handleSubmit} disabled={isSubmitting} className="bg-[#DB7706] hover:bg-[#DB7706] rounded-xl">
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {editingItem ? 'Updating...' : 'Adding...'}
                </>
              ) : (
                editingItem ? 'Update' : 'Add'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
}
