'use client';

import * as React from 'react';
import {
  Boxes,
  Plus,
  Minus,
  Search,
  Filter,
  AlertTriangle,
  AlertOctagon,
  CheckCircle2,
  ArrowRightLeft,
  Calendar,
  Layers,
  Sparkles,
  Download,
  Clock,
  History,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table';
import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Select } from '@/components/ui/select';
import { InventoryItem, Product, Store } from '@/types/database';
import { DataStore } from '@/lib/data-store';
import { useAppStore } from '@/store';
import { formatDate, downloadAsCSV } from '@/lib/utils';
import { toast } from 'sonner';

export default function InventoryPage() {
  const { currentStore } = useAppStore();
  const [inventory, setInventory] = React.useState<(InventoryItem & { product?: Product })[]>([]);
  const [stores, setStores] = React.useState<Store[]>([]);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [stockStatusFilter, setStockStatusFilter] = React.useState<'all' | 'healthy' | 'low' | 'out'>('all');

  // Adjustment Modal
  const [isAdjustOpen, setIsAdjustOpen] = React.useState(false);
  const [selectedItem, setSelectedItem] = React.useState<(InventoryItem & { product?: Product }) | null>(null);
  const [adjustDelta, setAdjustDelta] = React.useState<number>(10);
  const [adjustType, setAdjustType] = React.useState<'in' | 'out' | 'damaged'>('in');
  const [adjustReason, setAdjustReason] = React.useState('Supplier Restock Delivery');

  // Inter-store transfer modal
  const [isTransferOpen, setIsTransferOpen] = React.useState(false);
  const [transferTargetStore, setTransferTargetStore] = React.useState('store-2');
  const [transferQuantity, setTransferQuantity] = React.useState(5);

  const loadData = () => {
    setInventory(DataStore.getInventory(currentStore));
    setStores(DataStore.getStores());
  };

  React.useEffect(() => {
    loadData();
  }, [currentStore]);

  // Stock status helper
  const getStatus = (qty: number, min: number) => {
    if (qty === 0) return { label: 'Out of Stock', variant: 'destructive' as const, color: 'text-rose-600' };
    if (qty <= min) return { label: 'Low Stock', variant: 'warning' as const, color: 'text-amber-600' };
    return { label: 'Healthy Stock', variant: 'success' as const, color: 'text-emerald-600' };
  };

  // Filter items
  const filteredInventory = inventory.filter((item) => {
    const pName = item.product?.name || '';
    const sku = item.product?.sku || '';
    const batch = item.batch_number || '';
    const matchesSearch =
      pName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      batch.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (stockStatusFilter === 'healthy') return item.quantity > item.min_threshold;
    if (stockStatusFilter === 'low') return item.quantity <= item.min_threshold && item.quantity > 0;
    if (stockStatusFilter === 'out') return item.quantity === 0;

    return true;
  });

  // Handle Stock Adjustment
  const handleAdjustSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem) return;

    const delta = adjustType === 'in' ? Math.abs(adjustDelta) : -Math.abs(adjustDelta);
    const success = DataStore.adjustStock(selectedItem.id, delta, adjustReason);

    if (success) {
      toast.success('Stock adjusted successfully!', {
        description: `${selectedItem.product?.name} updated by ${delta > 0 ? `+${delta}` : delta} units.`,
      });
      setIsAdjustOpen(false);
      loadData();
    }
  };

  // Handle Transfer
  const handleTransferSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem) return;

    if (transferQuantity > selectedItem.quantity) {
      toast.error('Insufficient stock for transfer!');
      return;
    }

    DataStore.adjustStock(
      selectedItem.id,
      -transferQuantity,
      `Transfer to ${stores.find((s) => s.id === transferTargetStore)?.name || 'store'}`
    );

    toast.success('Inter-store stock transfer initiated!', {
      description: `Dispatched ${transferQuantity} units of ${selectedItem.product?.name}.`,
    });

    setIsTransferOpen(false);
    loadData();
  };

  // Summary counts
  const healthyCount = inventory.filter((i) => i.quantity > i.min_threshold).length;
  const lowCount = inventory.filter((i) => i.quantity <= i.min_threshold && i.quantity > 0).length;
  const outCount = inventory.filter((i) => i.quantity === 0).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Boxes className="h-6 w-6 text-red-600" />
            Inventory & Warehouse Command
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Real-time stock depletion, batch control, shelf replenishment and inter-store balance.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const exportRows = inventory.map((i) => ({
                Product: i.product?.name || 'Unknown',
                SKU: i.product?.sku || '',
                Barcode: i.product?.barcode || '',
                CurrentQuantity: i.quantity,
                MinThreshold: i.min_threshold,
                Batch: i.batch_number,
                ExpiryDate: i.expiry_date,
              }));
              downloadAsCSV(exportRows, `peNgo-Inventory-Audit-${new Date().toISOString().split('T')[0]}`);
              toast.success('Inventory audit exported as CSV');
            }}
            className="h-9 gap-1.5 text-xs"
          >
            <Download className="h-3.5 w-3.5" />
            Export Audit
          </Button>
        </div>
      </div>

      {/* Stock Health Badges */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Healthy */}
        <div
          onClick={() => setStockStatusFilter('healthy')}
          className={`cursor-pointer p-4 rounded-xl border transition-all ${
            stockStatusFilter === 'healthy'
              ? 'bg-emerald-50 border-emerald-500 dark:bg-emerald-950/40'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-emerald-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
              Healthy Stock
            </span>
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-slate-100 mt-1">
            {healthyCount} SKUs
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5">Sufficient shelf buffer</p>
        </div>

        {/* Low Stock */}
        <div
          onClick={() => setStockStatusFilter('low')}
          className={`cursor-pointer p-4 rounded-xl border transition-all ${
            stockStatusFilter === 'low'
              ? 'bg-amber-50 border-amber-500 dark:bg-amber-950/40'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-amber-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-amber-700 dark:text-amber-400 uppercase tracking-wider">
              Low Stock Warning
            </span>
            <AlertTriangle className="h-4 w-4 text-amber-600" />
          </div>
          <div className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-1">
            {lowCount} SKUs
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5">Below threshold replenishment level</p>
        </div>

        {/* Out of Stock */}
        <div
          onClick={() => setStockStatusFilter('out')}
          className={`cursor-pointer p-4 rounded-xl border transition-all ${
            stockStatusFilter === 'out'
              ? 'bg-rose-50 border-rose-500 dark:bg-rose-950/40'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-rose-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-rose-700 dark:text-rose-400 uppercase tracking-wider">
              Critical Out of Stock
            </span>
            <AlertOctagon className="h-4 w-4 text-rose-600" />
          </div>
          <div className="text-2xl font-black text-rose-600 dark:text-rose-400 mt-1">
            {outCount} SKUs
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5">Immediate purchase order required</p>
        </div>
      </div>

      {/* Filter and Search */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
            <div className="sm:col-span-8 relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search by SKU, product name or batch number..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-9 text-xs"
              />
            </div>

            <div className="sm:col-span-4">
              <Select
                value={stockStatusFilter}
                onChange={(e) => setStockStatusFilter(e.target.value as any)}
                className="h-9 text-xs"
              >
                <option value="all">All Stock Statuses</option>
                <option value="healthy">Healthy Only</option>
                <option value="low">Low Stock Only</option>
                <option value="out">Out of Stock Only</option>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <div>
            <CardTitle className="text-base font-bold">In-Store Inventory Records</CardTitle>
            <CardDescription>
              Inventory automatically decrements upon successful Exit Gate verification
            </CardDescription>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setStockStatusFilter('all')}
            className="text-xs"
          >
            Clear Filter
          </Button>
        </CardHeader>

        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>SKU & Product</TableHead>
                <TableHead>Current Qty</TableHead>
                <TableHead>Min Threshold</TableHead>
                <TableHead>Batch #</TableHead>
                <TableHead>Expiry Date</TableHead>
                <TableHead>Health Indicator</TableHead>
                <TableHead className="text-right">Stock Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInventory.map((item) => {
                const status = getStatus(item.quantity, item.min_threshold);
                const isNearExpiry = item.expiry_date
                  ? new Date(item.expiry_date).getTime() - Date.now() < 30 * 24 * 60 * 60 * 1000
                  : false;

                return (
                  <TableRow key={item.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40">
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-slate-100">
                          {item.product?.name || 'Retail Product'}
                        </span>
                        <span className="text-[11px] font-mono text-slate-500">
                          {item.product?.sku}
                        </span>
                      </div>
                    </TableCell>

                    <TableCell>
                      <span className={`text-base font-black ${status.color}`}>
                        {item.quantity} units
                      </span>
                    </TableCell>

                    <TableCell>
                      <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                        {item.min_threshold} units
                      </span>
                    </TableCell>

                    <TableCell>
                      <span className="text-xs font-mono font-semibold text-slate-700 dark:text-slate-300">
                        {item.batch_number}
                      </span>
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs text-slate-600 dark:text-slate-400">
                          {item.expiry_date ? formatDate(item.expiry_date) : 'N/A'}
                        </span>
                        {isNearExpiry && (
                          <Badge variant="destructive" className="text-[9px] px-1 py-0">
                            Expiring Soon
                          </Badge>
                        )}
                      </div>
                    </TableCell>

                    <TableCell>
                      <Badge variant={status.variant} className="text-[10px]">
                        {status.label}
                      </Badge>
                    </TableCell>

                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedItem(item);
                            setIsAdjustOpen(true);
                          }}
                          className="h-8 text-xs gap-1"
                        >
                          Adjust Qty
                        </Button>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedItem(item);
                            setIsTransferOpen(true);
                          }}
                          className="h-8 text-xs gap-1 text-slate-600 dark:text-slate-400"
                          title="Transfer to another store"
                        >
                          <ArrowRightLeft className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* ADJUST STOCK MODAL */}
      <Dialog open={isAdjustOpen} onOpenChange={setIsAdjustOpen}>
        <DialogHeader>
          <DialogTitle>Adjust In-Store Inventory</DialogTitle>
          <DialogDescription>
            {selectedItem?.product?.name} (Current: {selectedItem?.quantity} units)
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleAdjustSubmit} className="space-y-4">
          <div className="space-y-1">
            <Label className="text-xs">Adjustment Type</Label>
            <div className="grid grid-cols-3 gap-2">
              <Button
                type="button"
                variant={adjustType === 'in' ? 'default' : 'outline'}
                onClick={() => setAdjustType('in')}
                className="h-9 text-xs"
              >
                <Plus className="h-3.5 w-3.5 mr-1" />
                Stock In
              </Button>
              <Button
                type="button"
                variant={adjustType === 'out' ? 'destructive' : 'outline'}
                onClick={() => setAdjustType('out')}
                className="h-9 text-xs"
              >
                <Minus className="h-3.5 w-3.5 mr-1" />
                Stock Out
              </Button>
              <Button
                type="button"
                variant={adjustType === 'damaged' ? 'secondary' : 'outline'}
                onClick={() => setAdjustType('damaged')}
                className="h-9 text-xs"
              >
                Damaged
              </Button>
            </div>
          </div>

          <div className="space-y-1">
            <Label htmlFor="adj-qty" className="text-xs">Quantity to {adjustType.toUpperCase()}</Label>
            <Input
              id="adj-qty"
              type="number"
              min={1}
              required
              value={adjustDelta}
              onChange={(e) => setAdjustDelta(Number(e.target.value))}
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="adj-reason" className="text-xs">Audit Reason</Label>
            <Select
              id="adj-reason"
              value={adjustReason}
              onChange={(e) => setAdjustReason(e.target.value)}
            >
              <option value="Supplier Restock Delivery">Supplier Restock Delivery</option>
              <option value="Damaged Shelf Item">Damaged Shelf Item</option>
              <option value="Audit Count Correction">Physical Audit Count Correction</option>
              <option value="Customer Return">Customer Return</option>
            </Select>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsAdjustOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-red-600 hover:bg-red-700 text-white">
              Confirm Inventory Update
            </Button>
          </DialogFooter>
        </form>
      </Dialog>

      {/* INTER-STORE TRANSFER MODAL */}
      <Dialog open={isTransferOpen} onOpenChange={setIsTransferOpen}>
        <DialogHeader>
          <DialogTitle>Inter-Store Stock Transfer</DialogTitle>
          <DialogDescription>
            Dispatch stock from {stores.find((s) => s.id === currentStore)?.name || 'Current Store'} to another retail branch.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleTransferSubmit} className="space-y-4">
          <div className="space-y-1">
            <Label className="text-xs">Product</Label>
            <p className="text-sm font-bold text-slate-900 dark:text-slate-100">
              {selectedItem?.product?.name} (Available: {selectedItem?.quantity})
            </p>
          </div>

          <div className="space-y-1">
            <Label htmlFor="dest-store" className="text-xs">Destination Store</Label>
            <Select
              id="dest-store"
              value={transferTargetStore}
              onChange={(e) => setTransferTargetStore(e.target.value)}
            >
              {stores
                .filter((s) => s.id !== currentStore)
                .map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
            </Select>
          </div>

          <div className="space-y-1">
            <Label htmlFor="trans-qty" className="text-xs">Units to Transfer</Label>
            <Input
              id="trans-qty"
              type="number"
              min={1}
              max={selectedItem?.quantity || 1}
              value={transferQuantity}
              onChange={(e) => setTransferQuantity(Number(e.target.value))}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsTransferOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-red-600 hover:bg-red-700 text-white">
              Dispatch Inter-Store Transfer
            </Button>
          </DialogFooter>
        </form>
      </Dialog>
    </div>
  );
}
