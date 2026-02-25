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
import { Series } from '../types/database';

export default function SeriesPage() {
  const { series, products, addSeries, updateSeries, deleteSeries, isLoadingSeries } = useData();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    series_id: '',
    product_id: '',
    series_name: '',
  });

  const openDialog = (item) => {
    if (item) {
      setEditingItem(item);
      setFormData(item);
    } else {
      setEditingItem(null);
      setFormData({ series_id: '', product_id: '', series_name: '' });
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = async () => {
    if (!formData.series_id || !formData.product_id || !formData.series_name) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setIsSubmitting(true);
      if (editingItem) {
        await updateSeries(editingItem.series_id, formData);
        toast.success('Series updated successfully');
      } else {
        if (series.some(s => s.series_id === formData.series_id)) {
          toast.error('Series ID already exists');
          return;
        }
        await addSeries(formData);
        toast.success('Series added successfully');
      }
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error:', error);
      toast.error(error.response?.data?.message || (editingItem ? 'Failed to update series' : 'Failed to add series'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this series?')) {
      try {
        await deleteSeries(id);
        toast.success('Series deleted successfully');
      } catch (error) {
        console.error('Error:', error);
        toast.error('Failed to delete series');
      }
    }
  };

  return (
    <MainLayout>
      <PageHeader
        title="Series"
        description="Manage product series"
        action={
          <Button onClick={() => openDialog()} className="gap-2 bg-[#DB7706] hover:bg-[#DB7706] rounded-xl" disabled={isSubmitting}>
            <Plus className="h-4 w-4" />
            Add Series
          </Button>
        }
      />

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        {isLoadingSeries ? (
          <div className="flex items-center justify-center h-64">
            <div className="flex items-center gap-2">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Loading series...</span>
            </div>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="table-header">
                <TableHead>Series ID</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Series Name</TableHead>
                <TableHead className="w-24">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {series && series.length > 0 ? (
                series.map((item) => {
                  const product = products.find(p => p.product_id === item.product_id);
                  return (
                    <TableRow key={item.series_id} className="animate-fade-in">
                      <TableCell className="font-mono text-sm">{item.series_id}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium text-sm">{product?.product_name || 'N/A'}</p>
                          <p className="text-xs text-muted-foreground">{item.product_id}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="px-2 py-1 text-xs rounded-full bg-[#FEF1E1] text-[#DB7706] font-medium">
                          {item.series_name}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="icon" onClick={() => openDialog(item)} disabled={isSubmitting}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDelete(item.series_id)} disabled={isSubmitting}>
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
                    No series found
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
            <DialogTitle>{editingItem ? 'Edit Series' : 'Add Series'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Series ID *</Label>
              <Input
                value={formData.series_id}
                onChange={(e) => setFormData({ ...formData, series_id: e.target.value })}
                disabled={!!editingItem || isSubmitting}
                placeholder="e.g., SI1F-SER"
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
              <Label>Series Name *</Label>
              <Input
                value={formData.series_name}
                onChange={(e) => setFormData({ ...formData, series_name: e.target.value })}
                disabled={isSubmitting}
                placeholder="e.g., Fine, Prime, Supreme"
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
