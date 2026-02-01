"use client";

import { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash2, Edit } from "lucide-react";
import { getCategories, createCategory, deleteCategory, updateCategory } from "@/actions/category.actions";
import { toast } from "sonner";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const fetchCategories = async () => {
    const data = await getCategories();
    setCategories(data);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleEdit = (cat: any) => {
    setEditingId(cat._id);
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);

    try {
      if (editingId) {
        await updateCategory(editingId, formData);
        toast.success("Category updated");
      } else {
        await createCategory(formData);
        toast.success("Category created");
      }
      setEditingId(null);
      e.currentTarget.reset();
      fetchCategories();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    try {
      await deleteCategory(id);
      toast.success("Category deleted");
      fetchCategories();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold uppercase tracking-tighter">Categories</h1>
        <p className="text-muted-foreground uppercase tracking-widest text-sm font-medium">Classify your products</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <form
            key={editingId || "new"}
            onSubmit={handleSubmit}
            className="bg-muted/20 border-2 p-6 space-y-4 rounded-none h-fit sticky top-24"
          >
            <h3 className="font-bold uppercase tracking-widest text-sm mb-2">
              {editingId ? "Edit Category" : "New Category"}
            </h3>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest opacity-70">Category Name</label>
              <input
                name="name"
                defaultValue={editingId ? categories.find(c => c._id === editingId)?.name : ""}
                required
                className="w-full bg-background border-2 p-2 outline-none focus:border-primary rounded-none font-bold"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest opacity-70">Description</label>
              <textarea
                name="description"
                defaultValue={editingId ? categories.find(c => c._id === editingId)?.description : ""}
                rows={3}
                className="w-full bg-background border-2 p-2 outline-none focus:border-primary rounded-none"
              />
            </div>
            <div className="flex gap-2">
              <Button type="submit" className="flex-1 rounded-none uppercase font-bold tracking-widest" disabled={loading}>
                {loading ? "Processing..." : (editingId ? "Update" : "Add Category")}
              </Button>
              {editingId && (
                <Button type="button" variant="outline" className="rounded-none uppercase font-bold tracking-widest" onClick={cancelEdit}>
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </div>

        <div className="md:col-span-2 bg-background border-2 rounded-none h-fit">
          <Table>
            <TableHeader>
              <TableRow className="uppercase tracking-widest text-[10px] font-bold">
                <TableHead>Name</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((cat: any) => (
                <TableRow key={cat._id} className={editingId === cat._id ? "bg-muted" : ""}>
                  <TableCell className="font-bold text-sm uppercase tracking-tight">{cat.name}</TableCell>
                  <TableCell className="text-muted-foreground text-xs font-mono">{cat.slug}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(cat)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(cat._id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {categories.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-10 text-muted-foreground uppercase tracking-widest">No categories created.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
