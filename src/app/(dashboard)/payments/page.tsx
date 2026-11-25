'use client';

import * as React from 'react';
import {
  CreditCard,
  IndianRupee,
  Search,
  Filter,
  Download,
  CheckCircle2,
  AlertCircle,
  FileSpreadsheet,
  ArrowUpRight,
  ShieldCheck,
  Building2,
  Receipt,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table';
import { Select } from '@/components/ui/select';
import { Payment } from '@/types/database';
import { INITIAL_PAYMENTS, INITIAL_ORDERS } from '@/lib/data-store';
import { formatCurrency, formatDateTime, downloadAsCSV } from '@/lib/utils';
import { toast } from 'sonner';

export default function PaymentsPage() {
  const [payments, setPayments] = React.useState<Payment[]>(INITIAL_PAYMENTS);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [methodFilter, setMethodFilter] = React.useState('all');

  const filteredPayments = payments.filter((p) => {
    const matchesSearch =
      p.transaction_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.order_id.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesMethod = methodFilter === 'all' || p.method === methodFilter;

    return matchesSearch && matchesMethod;
  });

  const totalSettled = payments
    .filter((p) => p.status === 'success')
    .reduce((sum, p) => sum + p.amount, 0);

  const gstCollected = totalSettled * 0.142; // Blended 14.2% GST across catalog

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <CreditCard className="h-6 w-6 text-red-600" />
            Financial & Gateway Settlements
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Reconcile UPI QR checkouts, Razorpay webhooks, card acquirers and tax remittances.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            const rows = payments.map((p) => ({
              TransactionID: p.transaction_id,
              OrderID: p.order_id,
              Amount: p.amount,
              Method: p.method,
              Gateway: p.gateway,
              Status: p.status,
              Date: p.created_at,
            }));
            downloadAsCSV(rows, `peNgo-Payment-Settlements-${new Date().toISOString().split('T')[0]}`);
            toast.success('Payment settlement ledger exported as CSV');
          }}
          className="h-9 gap-1.5 text-xs"
        >
          <Download className="h-3.5 w-3.5" />
          Export Settlements CSV
        </Button>
      </div>

      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Total Settled GMV
              </span>
              <IndianRupee className="h-4 w-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-black text-slate-900 dark:text-slate-100 mt-2">
              {formatCurrency(totalSettled)}
            </div>
            <p className="text-[11px] text-emerald-600 font-semibold mt-0.5">
              100% Razorpay Auto-Reconciled
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Estimated GST Collection
              </span>
              <Receipt className="h-4 w-4 text-sky-600" />
            </div>
            <div className="text-2xl font-black text-sky-600 dark:text-sky-400 mt-2">
              {formatCurrency(gstCollected)}
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">CGST 50% + SGST 50%</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                UPI / Instant Pay Share
              </span>
              <Badge variant="secondary" className="text-[10px]">UPI</Badge>
            </div>
            <div className="text-2xl font-black text-purple-600 dark:text-purple-400 mt-2">
              68.5%
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">Zero payment friction via UPI QR</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Payment Success Rate
              </span>
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-2">
              99.8%
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">0 Chargeback disputes</p>
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
                placeholder="Search by Razorpay Transaction ID or Order Reference..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-9 text-xs"
              />
            </div>

            <div className="sm:col-span-4">
              <Select
                value={methodFilter}
                onChange={(e) => setMethodFilter(e.target.value)}
                className="h-9 text-xs"
              >
                <option value="all">All Payment Gateways & Rails</option>
                <option value="upi">UPI (GPay / PhonePe / Paytm)</option>
                <option value="card">Debit / Credit Card</option>
                <option value="wallet">Digital Wallet</option>
                <option value="cash">In-Store Cash Counter</option>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-bold">Settlement Ledger</CardTitle>
          <CardDescription>
            Verified transactions with encrypted token identifiers (Never storing card numbers or PINs)
          </CardDescription>
        </CardHeader>

        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Transaction Reference</TableHead>
                <TableHead>Order Link</TableHead>
                <TableHead>Amount (₹)</TableHead>
                <TableHead>Rail / Method</TableHead>
                <TableHead>Gateway</TableHead>
                <TableHead>Settlement Status</TableHead>
                <TableHead>Completed At</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPayments.map((pay) => (
                <TableRow key={pay.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40">
                  <TableCell className="font-mono font-bold text-xs text-slate-900 dark:text-slate-100">
                    {pay.transaction_id}
                  </TableCell>

                  <TableCell className="font-mono text-xs text-slate-600 dark:text-slate-400">
                    {pay.order_id}
                  </TableCell>

                  <TableCell className="font-black text-xs sm:text-sm text-slate-900 dark:text-slate-100">
                    {formatCurrency(pay.amount)}
                  </TableCell>

                  <TableCell>
                    <Badge variant="secondary" className="text-[10px] uppercase font-bold">
                      {pay.method}
                    </Badge>
                  </TableCell>

                  <TableCell className="text-xs font-semibold text-slate-600 dark:text-slate-400 capitalize">
                    {pay.gateway}
                  </TableCell>

                  <TableCell>
                    <Badge variant="success" className="text-[10px] capitalize">
                      {pay.status}
                    </Badge>
                  </TableCell>

                  <TableCell className="text-[11px] text-slate-500 whitespace-nowrap">
                    {formatDateTime(pay.created_at)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
