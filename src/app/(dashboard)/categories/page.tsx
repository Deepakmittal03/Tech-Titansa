'use client';

import * as React from 'react';
import {
  Layers,
  Plus,
  Edit,
  Trash2,
  Package,
  Search,
  Sparkles,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Category, Product } from '@/types/database';
import { DataStore } from '@/lib/data-store';
import { toast } from 'sonner';

export default function CategoriesPage() {
  const [categories, setCategories] = React.useState<Category[]>([]);
  const [products, setProducts] = React.useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = React.useState('');

  const [isCreateOpen, setIsCreateOpen] = React.useState(false);
  const [name, setName] = React.useState('');
  const [description, setDescription] = React.useState('');

  const loadData = () => {
    setCategories(DataStore.getCategories());
    setProducts(DataStore.getProducts());
  };

  React.useEffect(() => {
    loadData();
  }, []);

  const handleCreateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    DataStore.addCategory(name.trim(), description.trim());
    toast.success(`Category "${name}" created successfully!`);
    setName('');
    setDescription('');
    setIsCreateOpen(false);
    loadData();
  };

  const filteredCategories = categories.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Layers className="h-6 w-6 text-red-600" />
            Category & Aisle Management
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Organize in-store departments, shelf taxonomy and mobile customer navigation.
          </p>
        </div>

        <Button
          onClick={() => setIsCreateOpen(true)}
          className="bg-red-600 hover:bg-red-700 text-white gap-1.5 h-9 text-xs font-semibold"
        >
          <Plus className="h-4 w-4" />
          Add Department / Category
        </Button>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search retail categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-9 text-xs"
            />
          </div>
        </CardContent>
      </Card>

      {/* Grid of Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCategories.map((cat) => {
          const catProducts = products.filter((p) => p.category_id === cat.id);
          const totalInventoryValue = catProducts.reduce((sum, p) => sum + p.selling_price * 40, 0);

          return (
            <Card key={cat.id} className="hover:border-red-500/50 transition-all group">
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-600 dark:bg-red-950/60 dark:text-red-400 font-bold group-hover:scale-105 transition-transform">
                      <Layers className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                        {cat.name}
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {catProducts.length} Active SKUs
                      </p>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-[10px]">
                    Live
                  </Badge>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
                  <span>Aisle Capacity: Optimal</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    {catProducts.length > 0 ? 'In Stock' : 'Empty'}
                  </span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* CREATE CATEGORY MODAL */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogHeader>
          <DialogTitle>Add New Category</DialogTitle>
          <DialogDescription>
            Create an in-store department for customer app filtering.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleCreateCategory} className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="cat-name" className="text-xs">Category Name *</Label>
            <Input
              id="cat-name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Organic Produce & Fruits"
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="cat-desc" className="text-xs">Description</Label>
            <Input
              id="cat-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Department shelf notes..."
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-red-600 hover:bg-red-700 text-white">
              Create Category
            </Button>
          </DialogFooter>
        </form>
      </Dialog>
    </div>
  );
}
