'use client';

import * as React from 'react';
import {
  TicketPercent,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertCircle,
  Copy,
  Sparkles,
  Percent,
  IndianRupee,
  Users,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table';
import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Select } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Coupon } from '@/types/database';
import { DataStore } from '@/lib/data-store';
import { formatCurrency, formatDate } from '@/lib/utils';
import { toast } from 'sonner';

export default function CouponsPage() {
  const [coupons, setCoupons] = React.useState<Coupon[]>([]);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [isCreateOpen, setIsCreateOpen] = React.useState(false);

  const [formData, setFormData] = React.useState({
    code: '',
    type: 'percentage' as 'percentage' | 'fixed',
    discount_value: 20,
    min_cart_value: 499,
    max_discount: 100,
    usage_limit: 500,
    valid_from: '2024-11-24',
    valid_until: '2025-12-31',
    is_active: true,
  });

  const loadData = () => {
    setCoupons(DataStore.getCoupons());
  };

  React.useEffect(() => {
    loadData();
  }, []);

  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.code.trim()) return;

    DataStore.addCoupon({
      ...formData,
      code: formData.code.trim().toUpperCase(),
      discount_value: Number(formData.discount_value),
      min_cart_value: Number(formData.min_cart_value),
      max_discount: Number(formData.max_discount),
      usage_limit: Number(formData.usage_limit),
    });

    toast.success(`Coupon "${formData.code.toUpperCase()}" created!`, {
      description: 'Active for mobile self-checkout shoppers.',
    });

    setIsCreateOpen(false);
    loadData();
  };

  const handleCopyCode = (code: string) => {
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(code);
      toast.info(`Code "${code}" copied to clipboard!`);
    }
  };

  const filteredCoupons = coupons.filter((c) =>
    c.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <TicketPercent className="h-6 w-6 text-red-600" />
            Coupons & Promotional Engine
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Design targeted self-checkout discounts, minimum cart thresholds and redemptions.
          </p>
        </div>

        <Button
          onClick={() => {
            setFormData({
              code: `PENGO${Math.floor(10 + Math.random() * 90)}`,
              type: 'percentage',
              discount_value: 20,
              min_cart_value: 499,
              max_discount: 100,
              usage_limit: 500,
              valid_from: new Date().toISOString().split('T')[0],
              valid_until: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
              is_active: true,
            });
            setIsCreateOpen(true);
          }}
          className="bg-red-600 hover:bg-red-700 text-white gap-1.5 h-9 text-xs font-semibold"
        >
          <Plus className="h-4 w-4" />
          Create New Campaign
        </Button>
      </div>

      {/* Featured Campaign Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {coupons.map((c) => (
          <Card key={c.id} className="relative overflow-hidden group hover:border-red-500/50 transition-all">
            <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-red-100 dark:bg-red-950/40 opacity-40 group-hover:scale-125 transition-transform" />

            <CardContent className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <Badge
                  variant={c.is_active ? 'success' : 'outline'}
                  className="text-[10px]"
                >
                  {c.is_active ? 'Active' : 'Expired'}
                </Badge>
                <button
                  onClick={() => handleCopyCode(c.code)}
                  className="text-slate-400 hover:text-red-600 transition-colors p-1"
                  title="Copy Code"
                >
                  <Copy className="h-3.5 w-3.5" />
                </button>
              </div>

              <div>
                <p className="text-lg font-black font-mono tracking-wider text-slate-900 dark:text-slate-100">
                  {c.code}
                </p>
                <p className="text-xs font-bold text-red-600 dark:text-red-400 mt-0.5">
                  {c.type === 'percentage' ? `${c.discount_value}% OFF` : `Flat ₹${c.discount_value} OFF`}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-1 text-[11px] text-slate-500">
                <div className="flex justify-between">
                  <span>Min Basket Value:</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    {formatCurrency(c.min_cart_value || 0)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Max Cap:</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    {formatCurrency(c.max_discount || 0)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Redeemed:</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    {c.used_count || 0} / {c.usage_limit || '∞'}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Table of all Coupons */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-bold">Campaign Registry & Usage</CardTitle>
          <CardDescription>
            Validated server-side on mobile cart checkout before payment initialization
          </CardDescription>
        </CardHeader>

        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Discount Type</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Min Cart Value</TableHead>
                <TableHead>Max Cap</TableHead>
                <TableHead>Redemptions</TableHead>
                <TableHead>Expiry</TableHead>
                <TableHead className="text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCoupons.map((c) => (
                <TableRow key={c.id}>
                  <TableCell className="font-mono font-bold text-xs text-red-600 dark:text-red-400">
                    {c.code}
                  </TableCell>
                  <TableCell className="text-xs capitalize">{c.type}</TableCell>
                  <TableCell className="text-xs font-bold">
                    {c.type === 'percentage' ? `${c.discount_value}%` : formatCurrency(c.discount_value)}
                  </TableCell>
                  <TableCell className="text-xs">{formatCurrency(c.min_cart_value || 0)}</TableCell>
                  <TableCell className="text-xs">{formatCurrency(c.max_discount || 0)}</TableCell>
                  <TableCell className="text-xs font-semibold">
                    {c.used_count} of {c.usage_limit}
                  </TableCell>
                  <TableCell className="text-xs text-slate-500">
                    {c.valid_until ? formatDate(c.valid_until) : 'Open'}
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge variant={c.is_active ? 'success' : 'outline'} className="text-[10px]">
                      {c.is_active ? 'Active' : 'Expired'}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* CREATE COUPON MODAL */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogHeader>
          <DialogTitle>Create Promotional Campaign</DialogTitle>
          <DialogDescription>
            Deploy coupon code directly to peNgo self-checkout payment gateways.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleCreateCoupon} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs">Coupon Code *</Label>
              <Input
                required
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                placeholder="e.g. PENGO20"
                className="font-mono uppercase font-bold"
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs">Discount Scheme</Label>
              <Select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
              >
                <option value="percentage">Percentage (%) Discount</option>
                <option value="fixed">Fixed Amount (₹) Off</option>
              </Select>
            </div>

            <div className="space-y-1">
              <Label className="text-xs">
                Discount Value ({formData.type === 'percentage' ? '%' : '₹'}) *
              </Label>
              <Input
                type="number"
                required
                value={formData.discount_value}
                onChange={(e) => setFormData({ ...formData, discount_value: Number(e.target.value) })}
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs">Minimum Cart Threshold (₹)</Label>
              <Input
                type="number"
                value={formData.min_cart_value}
                onChange={(e) => setFormData({ ...formData, min_cart_value: Number(e.target.value) })}
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs">Maximum Discount Cap (₹)</Label>
              <Input
                type="number"
                value={formData.max_discount}
                onChange={(e) => setFormData({ ...formData, max_discount: Number(e.target.value) })}
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs">Total Usage Limit</Label>
              <Input
                type="number"
                value={formData.usage_limit}
                onChange={(e) => setFormData({ ...formData, usage_limit: Number(e.target.value) })}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-red-600 hover:bg-red-700 text-white">
              Launch Campaign
            </Button>
          </DialogFooter>
        </form>
      </Dialog>
    </div>
  );
}
