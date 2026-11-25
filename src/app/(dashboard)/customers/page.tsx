'use client';

import * as React from 'react';
import {
  Users,
  Search,
  Filter,
  Download,
  IndianRupee,
  ShoppingBag,
  Award,
  Calendar,
  Mail,
  Phone,
  ArrowUpRight,
  Sparkles,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table';
import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Customer } from '@/types/database';
import { DataStore } from '@/lib/data-store';
import { formatCurrency, formatDate, downloadAsCSV } from '@/lib/utils';
import { toast } from 'sonner';

export default function CustomersPage() {
  const [customers, setCustomers] = React.useState<Customer[]>([]);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [segmentFilter, setSegmentFilter] = React.useState('all');
  const [selectedCustomer, setSelectedCustomer] = React.useState<Customer | null>(null);
  const [isDetailOpen, setIsDetailOpen] = React.useState(false);

  React.useEffect(() => {
    setCustomers(DataStore.getCustomers());
  }, []);

  const filteredCustomers = customers.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.email || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.includes(searchQuery);

    const matchesSegment = segmentFilter === 'all' || c.segment === segmentFilter;

    return matchesSearch && matchesSegment;
  });

  const getSegmentBadge = (segment?: string) => {
    switch (segment) {
      case 'VIP':
        return <Badge variant="default" className="bg-purple-600 text-white">VIP Shopper</Badge>;
      case 'Regular':
        return <Badge variant="secondary">Frequent Shopper</Badge>;
      default:
        return <Badge variant="outline">New Customer</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Users className="h-6 w-6 text-red-600" />
            Customer Relationship Management (CRM)
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Monitor self-checkout customer loyalty profiles, basket frequency and total lifetime value (LTV).
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            const exportRows = customers.map((c) => ({
              Name: c.name,
              Email: c.email,
              Phone: c.phone,
              TotalPurchases: c.total_purchases,
              TotalSpent: c.total_spent,
              LoyaltyPoints: c.loyalty_points,
              Segment: c.segment || 'Regular',
              JoinedDate: c.created_at,
            }));
            downloadAsCSV(exportRows, `peNgo-Customer-Directory-${new Date().toISOString().split('T')[0]}`);
            toast.success('Customer directory exported as CSV');
          }}
          className="h-9 gap-1.5 text-xs"
        >
          <Download className="h-3.5 w-3.5" />
          Export Customer CSV
        </Button>
      </div>

      {/* CRM Highlight Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Total Registered App Users
              </span>
              <Users className="h-4 w-4 text-red-600" />
            </div>
            <div className="text-2xl font-black text-slate-900 dark:text-slate-100 mt-2">
              {customers.length} Shoppers
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">Scanned products in last 30 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Total Customer Lifetime Spend
              </span>
              <IndianRupee className="h-4 w-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-2">
              {formatCurrency(customers.reduce((acc, c) => acc + c.total_spent, 0))}
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">Cumulative cashless self-checkout GMV</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Loyalty Points Outstanding
              </span>
              <Award className="h-4 w-4 text-purple-600" />
            </div>
            <div className="text-2xl font-black text-purple-600 dark:text-purple-400 mt-2">
              {customers.reduce((acc, c) => acc + c.loyalty_points, 0)} pts
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">Redeemable at smart exit checkout</p>
          </CardContent>
        </Card>
      </div>

      {/* Filter and Search */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
            <div className="sm:col-span-8 relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search by customer name, email address, or phone number..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-9 text-xs"
              />
            </div>

            <div className="sm:col-span-4 flex gap-1">
              {(['all', 'VIP', 'Regular', 'New'] as const).map((seg) => (
                <Button
                  key={seg}
                  variant={segmentFilter === seg ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSegmentFilter(seg)}
                  className={`h-9 flex-1 text-xs capitalize ${segmentFilter === seg ? 'bg-red-600 text-white' : ''}`}
                >
                  {seg}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Customer Directory Table */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-bold">Customer Profiles ({filteredCustomers.length})</CardTitle>
          <CardDescription>
            Personal data protected under enterprise role-based authorization policies
          </CardDescription>
        </CardHeader>

        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer Name</TableHead>
                <TableHead>Contact Info</TableHead>
                <TableHead>Segment</TableHead>
                <TableHead>Checkouts</TableHead>
                <TableHead>Total Spent</TableHead>
                <TableHead>Loyalty Balance</TableHead>
                <TableHead>Member Since</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCustomers.map((cust) => (
                <TableRow key={cust.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 font-bold text-xs flex items-center justify-center">
                        {cust.name.slice(0, 2).toUpperCase()}
                      </div>
                      <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-slate-100">
                        {cust.name}
                      </span>
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="flex flex-col text-xs text-slate-600 dark:text-slate-400">
                      <span>{cust.email}</span>
                      <span className="text-[11px] text-slate-400">{cust.phone}</span>
                    </div>
                  </TableCell>

                  <TableCell>{getSegmentBadge(cust.segment)}</TableCell>

                  <TableCell className="text-xs font-semibold">
                    {cust.total_purchases} orders
                  </TableCell>

                  <TableCell className="font-black text-xs sm:text-sm text-slate-900 dark:text-slate-100">
                    {formatCurrency(cust.total_spent)}
                  </TableCell>

                  <TableCell>
                    <span className="font-bold text-xs text-purple-600 dark:text-purple-400 flex items-center gap-1">
                      <Award className="h-3.5 w-3.5" />
                      {cust.loyalty_points} pts
                    </span>
                  </TableCell>

                  <TableCell className="text-xs text-slate-500 whitespace-nowrap">
                    {formatDate(cust.created_at)}
                  </TableCell>

                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedCustomer(cust);
                        setIsDetailOpen(true);
                      }}
                      className="h-8 text-xs gap-1"
                    >
                      Profile
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* CUSTOMER PROFILE DETAIL MODAL */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogHeader>
          <DialogTitle>Shopper CRM Dossier</DialogTitle>
          <DialogDescription>
            Lifetime retail engagement and self-checkout activity profile.
          </DialogDescription>
        </DialogHeader>

        {selectedCustomer && (
          <div className="space-y-4 py-2 text-xs">
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex items-center gap-4">
              <div className="h-14 w-14 rounded-full bg-red-600 text-white font-black text-lg flex items-center justify-center shadow-lg shadow-red-600/30">
                {selectedCustomer.name.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">
                  {selectedCustomer.name}
                </h3>
                <p className="text-slate-500">{selectedCustomer.email} • {selectedCustomer.phone}</p>
                <div className="mt-1 flex items-center gap-2">
                  {getSegmentBadge(selectedCustomer.segment)}
                  <span className="text-[11px] text-slate-400">
                    Customer ID: {selectedCustomer.id}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3 rounded-lg bg-slate-100 dark:bg-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-bold">Lifetime Orders</span>
                <p className="text-lg font-black text-slate-900 dark:text-slate-100 mt-0.5">
                  {selectedCustomer.total_purchases}
                </p>
              </div>

              <div className="p-3 rounded-lg bg-slate-100 dark:bg-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-bold">Total Spent</span>
                <p className="text-lg font-black text-emerald-600 dark:text-emerald-400 mt-0.5">
                  {formatCurrency(selectedCustomer.total_spent)}
                </p>
              </div>

              <div className="p-3 rounded-lg bg-slate-100 dark:bg-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-bold">Loyalty Points</span>
                <p className="text-lg font-black text-purple-600 dark:text-purple-400 mt-0.5">
                  {selectedCustomer.loyalty_points}
                </p>
              </div>
            </div>

            <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
              <p className="font-bold text-slate-900 dark:text-slate-100 mb-1">
                Average Basket Size
              </p>
              <p className="text-slate-600 dark:text-slate-400">
                {formatCurrency(selectedCustomer.total_spent / (selectedCustomer.total_purchases || 1))} per trip. Preferred aisles: Snacks, Beverages.
              </p>
            </div>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => setIsDetailOpen(false)} className="w-full">
            Done
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
}
