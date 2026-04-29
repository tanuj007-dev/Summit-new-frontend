import { useState } from 'react';
import { useData } from '../../../context/DataContext';
import { MainLayout } from '../layout/MainLayout';
import { PageHeader } from '../layout/PageHeader';
import { Button } from '../layout/ui/button';
import { Input } from '../layout/ui/input';
import { Dialog, DialogContent } from '../layout/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../layout/ui/table';
import { Plus, Pencil, Trash2, Search, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import BlogForm from '../components/BlogForm';

export default function BlogsPage() {
  const { blogs, isLoadingBlogs, fetchBlogs, deleteBlog } = useData();
  const [search, setSearch] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);

  const filteredBlogs = blogs.filter(blog => 
    (blog.title || '').toLowerCase().includes(search.toLowerCase()) ||
    (blog.author || blog.author_name || '').toLowerCase().includes(search.toLowerCase())
  );

  const openDialog = (blog = null) => {
    setEditingBlog(blog);
    setIsDialogOpen(true);
  };

  const handleSuccess = () => {
    setIsDialogOpen(false);
    fetchBlogs();
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this blog?')) {
      try {
        await deleteBlog(id);
        toast.success('Blog deleted successfully');
      } catch (error) {
        console.error('Delete error:', error);
        toast.error('Failed to delete blog');
      }
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <PageHeader
          title="Blogs"
          description="Manage your blog posts and articles"
          action={
            <Button onClick={() => openDialog()} className="gap-2">
              <Plus className="h-4 w-4" />
              Add Blog Post
            </Button>
          }
        />

        {/* Filters */}
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by title or author..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Table */}
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          {isLoadingBlogs ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-orange-500" />
              <span className="ml-2">Loading blogs...</span>
            </div>
          ) : filteredBlogs.length === 0 ? (
            <div className="flex items-center justify-center py-8 text-muted-foreground">
              No blogs found
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50/50">
                  <TableHead>Title</TableHead>
                  <TableHead>Author</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead className="w-24">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBlogs.map((blog) => (
                  <TableRow key={blog.id}>
                    <TableCell className="font-medium">{blog.title}</TableCell>
                    <TableCell>{blog.author_name || blog.author || 'Admin'}</TableCell>
                    <TableCell className="text-muted-foreground text-sm font-mono">{blog.slug}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {blog.created_at ? new Date(blog.created_at).toLocaleDateString() : 'N/A'}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" onClick={() => openDialog(blog)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(blog.id)}>
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

        {/* Dialog for Blog Form */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-7xl max-h-[95vh] overflow-y-auto bg-slate-50 p-0 border-none">
            <BlogForm 
              mode={editingBlog ? "edit" : "add"}
              initialData={editingBlog}
              onSuccess={handleSuccess}
              onCancel={() => setIsDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
}
