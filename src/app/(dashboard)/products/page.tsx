'use client';

import * as React from 'react';
import {
  Package,
  Plus,
  Search,
  Filter,
  Download,
  Upload,
  Barcode,
  QrCode,
  Edit,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Tag,
  IndianRupee,
  Eye,
  Layers,
  Sparkles,
  X,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table';
import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Product, Category } from '@/types/database';
import { DataStore } from '@/lib/data-store';
import { formatCurrency, formatDate, downloadAsCSV } from '@/lib/utils';
import { toast } from 'sonner';
import QRCodeComponent from 'qrcode';

export default function ProductsPage() {
  const [products, setProducts] = React.useState<Product[]>([]);
  const [categories, setCategories] = React.useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState('all');
  const [statusFilter, setStatusFilter] = React.useState('all');

  // Modal states
  const [isCreateOpen, setIsCreateOpen] = React.useState(false);
  const [isEditOpen, setIsEditOpen] = React.useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = React.useState(false);
  const [isQROpen, setIsQROpen] = React.useState(false);
  const [selectedProduct, setSelectedProduct] = React.useState<Product | null>(null);
  const [qrCodeDataUrl, setQrCodeDataUrl] = React.useState<string>('');

  // Form states
  const [formData, setFormData] = React.useState({
    name: '',
    description: '',
    sku: '',
    barcode: '',
    brand: '',
    category_id: '',
    mrp: 100,
    selling_price: 90,
    gst_rate: 18,
    is_active: true,
    image_url: '',
  });

  const loadData = () => {
    setProducts(DataStore.getProducts());
    setCategories(DataStore.getCategories());
  };

  React.useEffect(() => {
    loadData();
  }, []);

  // Filtered products
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.barcode.includes(searchQuery) ||
      p.brand.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === 'all' || p.category_id === selectedCategory;

    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'active' ? p.is_active : !p.is_active);

    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Open Create Modal
  const handleOpenCreate = () => {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    setFormData({
      name: '',
      description: '',
      sku: `SKU-${randomSuffix}`,
      barcode: `890${Math.floor(1000000000 + Math.random() * 9000000000)}`,
      brand: '',
      category_id: categories[0]?.id || '',
      mrp: 150,
      selling_price: 135,
      gst_rate: 18,
      is_active: true,
      image_url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=400',
    });
    setIsCreateOpen(true);
  };

  // Submit Create Product
  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Barcode uniqueness validation
    const existing = products.find((p) => p.barcode === formData.barcode.trim());
    if (existing) {
      toast.error('Barcode already registered!', {
        description: `Barcode ${formData.barcode} is already assigned to "${existing.name}". Barcodes must be unique.`,
      });
      return;
    }

    DataStore.addProduct({
      ...formData,
      mrp: Number(formData.mrp),
      selling_price: Number(formData.selling_price),
      gst_rate: Number(formData.gst_rate),
    });

    toast.success('Product added successfully!', {
      description: `${formData.name} is now available in the mobile app catalog.`,
    });

    setIsCreateOpen(false);
    loadData();
  };

  // Open Edit Modal
  const handleOpenEdit = (product: Product) => {
    setSelectedProduct(product);
    setFormData({
      name: product.name,
      description: product.description || '',
      sku: product.sku,
      barcode: product.barcode,
      brand: product.brand,
      category_id: product.category_id || '',
      mrp: product.mrp,
      selling_price: product.selling_price,
      gst_rate: product.gst_rate,
      is_active: product.is_active,
      image_url: product.image_url || '',
    });
    setIsEditOpen(true);
  };

  // Submit Edit Product
  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;

    // Check barcode conflict with other products
    const conflict = products.find(
      (p) => p.barcode === formData.barcode.trim() && p.id !== selectedProduct.id
    );
    if (conflict) {
      toast.error('Barcode conflict!', {
        description: `Barcode is already in use by "${conflict.name}".`,
      });
      return;
    }

    DataStore.updateProduct(selectedProduct.id, {
      ...formData,
      mrp: Number(formData.mrp),
      selling_price: Number(formData.selling_price),
      gst_rate: Number(formData.gst_rate),
    });

    toast.success('Product updated successfully!');
    setIsEditOpen(false);
    loadData();
  };

  // Delete Product
  const handleDeleteConfirm = () => {
    if (!selectedProduct) return;
    DataStore.deleteProduct(selectedProduct.id);
    toast.success(`Product "${selectedProduct.name}" removed from catalog.`);
    setIsDeleteOpen(false);
    loadData();
  };

  // Generate & Show QR Code
  const handleShowQR = async (product: Product) => {
    setSelectedProduct(product);
    try {
      // In peNgo, customer app scans either the EAN-13 barcode or the peNgo smart QR
      const qrPayload = JSON.stringify({
        id: product.id,
        sku: product.sku,
        barcode: product.barcode,
        price: product.selling_price,
        system: 'peNgo-Retail',
      });
      const url = await QRCodeComponent.toDataURL(qrPayload, {
        width: 320,
        margin: 2,
        color: { dark: '#0F172A', light: '#FFFFFF' },
      });
      setQrCodeDataUrl(url);
      setIsQROpen(true);
    } catch (err) {
      toast.error('Failed to generate QR code');
    }
  };

  // Bulk Export CSV
  const handleExportCSV = () => {
    const exportData = products.map((p) => ({
      ID: p.id,
      Name: p.name,
      SKU: p.sku,
      Barcode: p.barcode,
      Brand: p.brand,
      Category: categories.find((c) => c.id === p.category_id)?.name || 'Unknown',
      MRP: p.mrp,
      SellingPrice: p.selling_price,
      GSTRate: `${p.gst_rate}%`,
      Active: p.is_active ? 'YES' : 'NO',
      Created: p.created_at,
    }));
    downloadAsCSV(exportData, `peNgo-Product-Catalog-${new Date().toISOString().split('T')[0]}`);
    toast.success('Catalog exported as CSV successfully!');
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Package className="h-6 w-6 text-red-600" />
            Smart Product Catalog
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Configure mobile-scannable retail SKUs, EAN barcodes, tax structures and pricing tiers.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportCSV}
            className="h-9 gap-1.5 text-xs"
          >
            <Download className="h-3.5 w-3.5" />
            Export CSV
          </Button>

          <Button
            size="sm"
            onClick={handleOpenCreate}
            className="h-9 gap-1.5 text-xs bg-red-600 hover:bg-red-700 text-white font-semibold"
          >
            <Plus className="h-4 w-4" />
            Add New SKU
          </Button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
            {/* Search Input */}
            <div className="sm:col-span-5 relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search by product name, SKU, barcode, or brand..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-9 text-xs"
              />
            </div>

            {/* Category Dropdown */}
            <div className="sm:col-span-4">
              <Select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="h-9 text-xs"
              >
                <option value="all">All Departments / Categories</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </Select>
            </div>

            {/* Status Dropdown */}
            <div className="sm:col-span-3">
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="h-9 text-xs"
              >
                <option value="all">Status: All SKUs</option>
                <option value="active">Active Only</option>
                <option value="inactive">Inactive / Hidden</option>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Product Catalog Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <div>
            <CardTitle className="text-base font-bold">Catalog Items ({filteredProducts.length})</CardTitle>
            <CardDescription>Instant sync enabled with peNgo Customer Scanner App</CardDescription>
          </div>
          <Badge variant="outline" className="text-xs">
            {products.filter((p) => p.is_active).length} Active Online
          </Badge>
        </CardHeader>

        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">Item</TableHead>
                <TableHead>Product Name & Brand</TableHead>
                <TableHead>SKU & Barcode</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>MRP / Selling Price</TableHead>
                <TableHead>GST</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-12 text-slate-400">
                    <Package className="h-10 w-10 mx-auto mb-2 opacity-40" />
                    <p className="font-semibold text-sm">No products found matching filters</p>
                    <p className="text-xs mt-0.5">Try clearing your search query or add a new SKU</p>
                  </TableCell>
                </TableRow>
              ) : (
                filteredProducts.map((p) => {
                  const cat = categories.find((c) => c.id === p.category_id);
                  return (
                    <TableRow key={p.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40">
                      {/* Thumbnail */}
                      <TableCell>
                        <div className="h-11 w-11 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 flex items-center justify-center">
                          {p.image_url ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={p.image_url}
                              alt={p.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <Package className="h-5 w-5 text-slate-400" />
                          )}
                        </div>
                      </TableCell>

                      {/* Name & Brand */}
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-slate-100">
                            {p.name}
                          </span>
                          <span className="text-[11px] text-slate-500 font-medium">
                            Brand: {p.brand}
                          </span>
                        </div>
                      </TableCell>

                      {/* SKU & Barcode */}
                      <TableCell>
                        <div className="flex flex-col gap-0.5">
                          <span className="text-xs font-mono font-semibold text-slate-700 dark:text-slate-300">
                            {p.sku}
                          </span>
                          <span className="text-[11px] font-mono text-slate-500 flex items-center gap-1">
                            <Barcode className="h-3 w-3" />
                            {p.barcode}
                          </span>
                        </div>
                      </TableCell>

                      {/* Category */}
                      <TableCell>
                        <Badge variant="secondary" className="text-[11px]">
                          {cat?.name || 'General'}
                        </Badge>
                      </TableCell>

                      {/* Pricing */}
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-bold text-xs sm:text-sm text-red-600 dark:text-red-400">
                            {formatCurrency(p.selling_price)}
                          </span>
                          {p.mrp > p.selling_price && (
                            <span className="text-[10px] text-slate-400 line-through">
                              MRP {formatCurrency(p.mrp)}
                            </span>
                          )}
                        </div>
                      </TableCell>

                      {/* GST Rate */}
                      <TableCell>
                        <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                          {p.gst_rate}%
                        </span>
                      </TableCell>

                      {/* Status */}
                      <TableCell>
                        <Badge
                          variant={p.is_active ? 'success' : 'outline'}
                          className="text-[10px]"
                        >
                          {p.is_active ? 'Live' : 'Hidden'}
                        </Badge>
                      </TableCell>

                      {/* Actions */}
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          {/* QR Code generator */}
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleShowQR(p)}
                            className="h-8 w-8 text-slate-500 hover:text-red-600"
                            title="Generate Scan QR Code"
                          >
                            <QrCode className="h-4 w-4" />
                          </Button>

                          {/* Edit button */}
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleOpenEdit(p)}
                            className="h-8 w-8 text-slate-500 hover:text-slate-900 dark:hover:text-slate-100"
                            title="Edit Product"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>

                          {/* Delete button */}
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setSelectedProduct(p);
                              setIsDeleteOpen(true);
                            }}
                            className="h-8 w-8 text-slate-500 hover:text-rose-600"
                            title="Delete SKU"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* CREATE PRODUCT MODAL */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogHeader>
          <DialogTitle>Add New Retail SKU to peNgo</DialogTitle>
          <DialogDescription>
            Register product details, barcode, pricing, and category classification.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleCreateSubmit} className="space-y-4 max-h-[75vh] overflow-y-auto px-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="sm:col-span-2 space-y-1">
              <Label htmlFor="create-name" className="text-xs">Product Name *</Label>
              <Input
                id="create-name"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Red Bull Energy Drink (250ml)"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="create-brand" className="text-xs">Brand Name *</Label>
              <Input
                id="create-brand"
                required
                value={formData.brand}
                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                placeholder="e.g. Red Bull"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="create-category" className="text-xs">Category *</Label>
              <Select
                id="create-category"
                value={formData.category_id}
                onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </Select>
            </div>

            <div className="space-y-1">
              <Label htmlFor="create-sku" className="text-xs">SKU Code *</Label>
              <Input
                id="create-sku"
                required
                value={formData.sku}
                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                placeholder="e.g. BEV-RB-250"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="create-barcode" className="text-xs">EAN Barcode Number *</Label>
              <Input
                id="create-barcode"
                required
                value={formData.barcode}
                onChange={(e) => setFormData({ ...formData, barcode: e.target.value })}
                placeholder="e.g. 8901234567890"
              />
              <p className="text-[10px] text-slate-500">Verified for uniqueness across retail system.</p>
            </div>

            <div className="space-y-1">
              <Label htmlFor="create-mrp" className="text-xs">MRP (₹) *</Label>
              <Input
                id="create-mrp"
                type="number"
                step="0.01"
                required
                value={formData.mrp}
                onChange={(e) => setFormData({ ...formData, mrp: Number(e.target.value) })}
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="create-selling-price" className="text-xs">Selling Price (₹) *</Label>
              <Input
                id="create-selling-price"
                type="number"
                step="0.01"
                required
                value={formData.selling_price}
                onChange={(e) => setFormData({ ...formData, selling_price: Number(e.target.value) })}
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="create-gst" className="text-xs">GST Tax Slab (%) *</Label>
              <Select
                id="create-gst"
                value={formData.gst_rate}
                onChange={(e) => setFormData({ ...formData, gst_rate: Number(e.target.value) })}
              >
                <option value={0}>0% (Exempt)</option>
                <option value={5}>5% (Essential Foods / Grains)</option>
                <option value={12}>12% (Processed Foods / Snacks)</option>
                <option value={18}>18% (Standard FMCG / Beverages)</option>
                <option value={28}>28% (Luxury / Aerated Drinks)</option>
              </Select>
            </div>

            <div className="space-y-1">
              <Label htmlFor="create-image" className="text-xs">Product Image URL</Label>
              <Input
                id="create-image"
                value={formData.image_url}
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                placeholder="https://images.unsplash.com/..."
              />
            </div>

            <div className="sm:col-span-2 space-y-1">
              <Label htmlFor="create-description" className="text-xs">Product Description</Label>
              <Textarea
                id="create-description"
                rows={2}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Key ingredients, net weight, pack size..."
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-red-600 hover:bg-red-700 text-white">
              Save & Register SKU
            </Button>
          </DialogFooter>
        </form>
      </Dialog>

      {/* EDIT PRODUCT MODAL */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogHeader>
          <DialogTitle>Edit Product SKU</DialogTitle>
          <DialogDescription>
            Update pricing, descriptions, barcode or visibility settings.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleEditSubmit} className="space-y-4 max-h-[75vh] overflow-y-auto px-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="sm:col-span-2 space-y-1">
              <Label htmlFor="edit-name" className="text-xs">Product Name</Label>
              <Input
                id="edit-name"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="edit-brand" className="text-xs">Brand</Label>
              <Input
                id="edit-brand"
                required
                value={formData.brand}
                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="edit-category" className="text-xs">Category</Label>
              <Select
                id="edit-category"
                value={formData.category_id}
                onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </Select>
            </div>

            <div className="space-y-1">
              <Label htmlFor="edit-barcode" className="text-xs">Barcode</Label>
              <Input
                id="edit-barcode"
                required
                value={formData.barcode}
                onChange={(e) => setFormData({ ...formData, barcode: e.target.value })}
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="edit-selling-price" className="text-xs">Selling Price (₹)</Label>
              <Input
                id="edit-selling-price"
                type="number"
                step="0.01"
                required
                value={formData.selling_price}
                onChange={(e) => setFormData({ ...formData, selling_price: Number(e.target.value) })}
              />
            </div>

            <div className="sm:col-span-2 flex items-center justify-between p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-slate-100">Live in Mobile Catalog</p>
                <p className="text-[11px] text-slate-500">Enable customers to scan and add this item to cart</p>
              </div>
              <Switch
                checked={formData.is_active}
                onCheckedChange={(val) => setFormData({ ...formData, is_active: val })}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsEditOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-red-600 hover:bg-red-700 text-white">
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </Dialog>

      {/* QR CODE & BARCODE VIEWER MODAL */}
      <Dialog open={isQROpen} onOpenChange={setIsQROpen}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <QrCode className="h-5 w-5 text-red-600" />
            peNgo Smart Scan Pass
          </DialogTitle>
          <DialogDescription>
            Point the peNgo customer mobile app camera at this QR or barcode to simulate shopping.
          </DialogDescription>
        </DialogHeader>

        {selectedProduct && (
          <div className="flex flex-col items-center justify-center p-4 space-y-4">
            <div className="p-4 bg-white rounded-2xl border-2 border-slate-200 shadow-xl flex flex-col items-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={qrCodeDataUrl}
                alt="Product QR"
                className="w-56 h-56 object-contain"
              />
              <div className="mt-3 text-center">
                <p className="text-xs font-mono font-bold text-slate-900 tracking-wider">
                  EAN: {selectedProduct.barcode}
                </p>
                <p className="text-[11px] font-mono text-slate-500">
                  SKU: {selectedProduct.sku}
                </p>
              </div>
            </div>

            <div className="text-center">
              <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                {selectedProduct.name}
              </h4>
              <p className="text-base font-black text-red-600 dark:text-red-400 mt-0.5">
                {formatCurrency(selectedProduct.selling_price)}
              </p>
            </div>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => setIsQROpen(false)} className="w-full">
            Close Scanner Modal
          </Button>
        </DialogFooter>
      </Dialog>

      {/* DELETE CONFIRMATION MODAL */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogHeader>
          <DialogTitle className="text-rose-600 flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            Delete Product SKU
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to delete &quot;{selectedProduct?.name}&quot;? Customers will no longer be able to scan or purchase this item.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDeleteConfirm}>
            Delete Permanently
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
}
