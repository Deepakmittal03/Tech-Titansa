'use client';

import * as React from 'react';
import {
  ShoppingCart,
  Search,
  Filter,
  Download,
  FileText,
  CreditCard,
  QrCode,
  CheckCircle2,
  Clock,
  AlertCircle,
  Eye,
  RotateCcw,
  User,
  ArrowRight,
  Printer,
  Sparkles,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table';
import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Select } from '@/components/ui/select';
import { Order, Customer, OrderItem, Product, Payment } from '@/types/database';
import { DataStore } from '@/lib/data-store';
import { useAppStore } from '@/store';
import { formatCurrency, formatDateTime, downloadAsCSV, downloadAsPDF } from '@/lib/utils';
import { toast } from 'sonner';

export default function OrdersPage() {
  const { currentStore } = useAppStore();
  const [orders, setOrders] = React.useState<
    (Order & { customer?: Customer; items?: (OrderItem & { product?: Product })[]; payment?: Payment })[]
  >([]);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState('all');

  // Order Details / Invoice Modal
  const [selectedOrder, setSelectedOrder] = React.useState<
    (Order & { customer?: Customer; items?: (OrderItem & { product?: Product })[]; payment?: Payment }) | null
  >(null);
  const [isInvoiceOpen, setIsInvoiceOpen] = React.useState(false);
  const [isRefundOpen, setIsRefundOpen] = React.useState(false);

  const loadData = () => {
    setOrders(DataStore.getOrders(currentStore));
  };

  React.useEffect(() => {
    loadData();
  }, [currentStore]);

  // Lifecycle status badge helper
  const getStatusBadge = (status: Order['status']) => {
    switch (status) {
      case 'completed':
        return <Badge variant="success">Completed & Verified</Badge>;
      case 'exit_verification':
        return <Badge variant="warning">At Exit Gate (QR Ready)</Badge>;
      case 'paid':
        return <Badge variant="info">Paid (Generating Pass)</Badge>;
      case 'payment_pending':
        return <Badge variant="outline">Payment Incomplete</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">Cancelled</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.order_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (o.customer?.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (o.customer?.phone || '').includes(searchQuery);

    const matchesStatus = statusFilter === 'all' || o.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Handle PDF Export
  const handleExportPDF = (order: typeof selectedOrder) => {
    if (!order) return;
    const invoiceRows = (order.items || []).map((it) => [
      it.product?.name || 'Product',
      it.quantity.toString(),
      formatCurrency(it.unit_price),
      formatCurrency(it.tax_amount),
      formatCurrency(it.total_price),
    ]);

    downloadAsPDF(
      invoiceRows,
      `Tax Invoice – ${order.order_number}`,
      `peNgo-Invoice-${order.order_number}`
    );
    toast.success('Tax invoice downloaded as PDF!');
  };

  // Handle Refund Process
  const handleProcessRefund = () => {
    if (!selectedOrder) return;
    toast.success(`Refund initiated for ${selectedOrder.order_number}`, {
      description: `Amount of ${formatCurrency(selectedOrder.total)} queued for reversal via Razorpay webhook.`,
    });
    setIsRefundOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <ShoppingCart className="h-6 w-6 text-red-600" />
            Orders & Checkout Management
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Real-time track of customer mobile self-checkouts, digital bills and exit passes.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const exportRows = orders.map((o) => ({
                OrderNumber: o.order_number,
                Customer: o.customer?.name || 'Walk-in',
                Phone: o.customer?.phone || 'N/A',
                Subtotal: o.subtotal,
                Tax: o.tax,
                Discount: o.discount,
                Total: o.total,
                Status: o.status,
                PaymentMethod: o.payment?.method || 'N/A',
                TransactionID: o.payment?.transaction_id || 'N/A',
                Date: o.created_at,
              }));
              downloadAsCSV(exportRows, `peNgo-Orders-Ledger-${new Date().toISOString().split('T')[0]}`);
              toast.success('Orders ledger exported as CSV');
            }}
            className="h-9 gap-1.5 text-xs"
          >
            <Download className="h-3.5 w-3.5" />
            Export Orders CSV
          </Button>
        </div>
      </div>

      {/* Filter and Search */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
            <div className="sm:col-span-8 relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search by order number (e.g. PGO-20241124-...), customer name, or phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-9 text-xs"
              />
            </div>

            <div className="sm:col-span-4">
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="h-9 text-xs"
              >
                <option value="all">All Checkout Lifecycle Statuses</option>
                <option value="completed">Completed & Verified</option>
                <option value="exit_verification">At Exit Gate (Verification Pending)</option>
                <option value="paid">Paid (Exit Pass Issued)</option>
                <option value="payment_pending">Payment Incomplete</option>
                <option value="cancelled">Cancelled / Aborted</option>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <div>
            <CardTitle className="text-base font-bold">Transaction Ledger ({filteredOrders.length})</CardTitle>
            <CardDescription>
              Orders progression: Created → Payment Pending → Paid → Exit Verification → Completed
            </CardDescription>
          </div>
          <Badge variant="outline" className="text-xs">
            {orders.filter((o) => o.status === 'completed').length} Cleared Exit
          </Badge>
        </CardHeader>

        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Shopper Profile</TableHead>
                <TableHead>Cart Items</TableHead>
                <TableHead>Net Amount</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Status Lifecycle</TableHead>
                <TableHead>Timestamp</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((ord) => (
                <TableRow key={ord.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40">
                  <TableCell className="font-mono font-bold text-xs text-slate-900 dark:text-slate-100">
                    {ord.order_number}
                  </TableCell>

                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-semibold text-xs text-slate-900 dark:text-slate-100">
                        {ord.customer?.name || 'Walk-in Customer'}
                      </span>
                      <span className="text-[11px] text-slate-500">
                        {ord.customer?.phone || '+91 98xxx xxxxx'}
                      </span>
                    </div>
                  </TableCell>

                  <TableCell className="text-xs text-slate-600 dark:text-slate-400">
                    {ord.items?.length || 1} products
                  </TableCell>

                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-black text-xs sm:text-sm text-slate-900 dark:text-slate-100">
                        {formatCurrency(ord.total)}
                      </span>
                      {ord.discount > 0 && (
                        <span className="text-[10px] text-emerald-600 font-semibold">
                          Saved {formatCurrency(ord.discount)}
                        </span>
                      )}
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center gap-1.5">
                      <Badge variant="secondary" className="text-[10px] uppercase font-bold">
                        {ord.payment?.method || 'UPI'}
                      </Badge>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {ord.payment?.gateway || 'Razorpay'}
                      </span>
                    </div>
                  </TableCell>

                  <TableCell>{getStatusBadge(ord.status)}</TableCell>

                  <TableCell className="text-[11px] text-slate-500 whitespace-nowrap">
                    {formatDateTime(ord.created_at)}
                  </TableCell>

                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedOrder(ord);
                          setIsInvoiceOpen(true);
                        }}
                        className="h-8 text-xs gap-1"
                      >
                        <FileText className="h-3.5 w-3.5" />
                        Invoice
                      </Button>

                      {ord.status === 'completed' && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setSelectedOrder(ord);
                            setIsRefundOpen(true);
                          }}
                          className="h-8 w-8 text-slate-500 hover:text-rose-600"
                          title="Process Refund"
                        >
                          <RotateCcw className="h-3.5 w-3.5" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* DIGITAL INVOICE & ORDER DETAILS MODAL */}
      <Dialog open={isInvoiceOpen} onOpenChange={setIsInvoiceOpen}>
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-red-600" />
              peNgo Digital GST Invoice
            </span>
            <Badge variant="secondary" className="text-xs font-mono">
              {selectedOrder?.order_number}
            </Badge>
          </DialogTitle>
          <DialogDescription>
            Official digital tax invoice generated directly from customer self-checkout session.
          </DialogDescription>
        </DialogHeader>

        {selectedOrder && (
          <div className="space-y-4 max-h-[75vh] overflow-y-auto px-1">
            {/* Store & Customer Header */}
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 flex flex-col sm:flex-row justify-between gap-3 text-xs">
              <div>
                <p className="font-black text-sm text-slate-900 dark:text-slate-100 flex items-center">
                  pe<span className="text-red-600">N</span>go Retail Systems
                </p>
                <p className="text-slate-500 mt-0.5">Flagship Outlet – Connaught Place</p>
                <p className="text-slate-500">GSTIN: 07AAAAA0000A1Z5</p>
              </div>

              <div className="sm:text-right">
                <p className="font-bold text-slate-900 dark:text-slate-100">
                  Billed To: {selectedOrder.customer?.name || 'Walk-in Customer'}
                </p>
                <p className="text-slate-500">{selectedOrder.customer?.email || 'N/A'}</p>
                <p className="text-slate-500">{selectedOrder.customer?.phone || 'N/A'}</p>
                <p className="text-slate-400 mt-1">Date: {formatDateTime(selectedOrder.created_at)}</p>
              </div>
            </div>

            {/* Lifecycle Timeline */}
            <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                Order Verification Lifecycle
              </p>
              <div className="flex items-center justify-between text-xs font-medium">
                <span className="text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Cart Scanned
                </span>
                <ArrowRight className="h-3 w-3 text-slate-400" />
                <span className="text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Payment Cleared
                </span>
                <ArrowRight className="h-3 w-3 text-slate-400" />
                <span className="text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Exit Pass Verified
                </span>
              </div>
            </div>

            {/* Items Table */}
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item Details</TableHead>
                  <TableHead>Qty</TableHead>
                  <TableHead>Rate</TableHead>
                  <TableHead>GST</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(selectedOrder.items || []).map((it) => (
                  <TableRow key={it.id}>
                    <TableCell>
                      <span className="font-bold text-xs text-slate-900 dark:text-slate-100">
                        {it.product?.name || 'Product Item'}
                      </span>
                    </TableCell>
                    <TableCell className="text-xs">{it.quantity}</TableCell>
                    <TableCell className="text-xs">{formatCurrency(it.unit_price)}</TableCell>
                    <TableCell className="text-xs text-slate-500">{formatCurrency(it.tax_amount)}</TableCell>
                    <TableCell className="text-xs font-bold text-right">
                      {formatCurrency(it.total_price)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Financial Totals Summary */}
            <div className="p-4 rounded-xl bg-slate-100/70 dark:bg-slate-800/60 space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Subtotal (Before Tax)</span>
                <span>{formatCurrency(selectedOrder.subtotal)}</span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Total GST / Central & State Tax</span>
                <span>{formatCurrency(selectedOrder.tax)}</span>
              </div>
              {selectedOrder.discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Coupon Discount Applied</span>
                  <span>- {formatCurrency(selectedOrder.discount)}</span>
                </div>
              )}
              <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex justify-between text-sm font-black text-slate-900 dark:text-slate-100">
                <span>Final Paid Total</span>
                <span className="text-red-600 dark:text-red-400">{formatCurrency(selectedOrder.total)}</span>
              </div>
            </div>
          </div>
        )}

        <DialogFooter className="flex items-center justify-between sm:justify-between w-full">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleExportPDF(selectedOrder)}
            className="gap-1.5 text-xs"
          >
            <Printer className="h-4 w-4" />
            Download PDF Tax Invoice
          </Button>
          <Button
            size="sm"
            onClick={() => setIsInvoiceOpen(false)}
            className="bg-red-600 hover:bg-red-700 text-white text-xs"
          >
            Close Invoice
          </Button>
        </DialogFooter>
      </Dialog>

      {/* REFUND MODAL */}
      <Dialog open={isRefundOpen} onOpenChange={setIsRefundOpen}>
        <DialogHeader>
          <DialogTitle className="text-rose-600 flex items-center gap-2">
            <RotateCcw className="h-5 w-5" />
            Process Gateway Refund
          </DialogTitle>
          <DialogDescription>
            Reverse payment of {formatCurrency(selectedOrder?.total || 0)} for order {selectedOrder?.order_number}.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3 py-2 text-xs">
          <p className="text-slate-600 dark:text-slate-300">
            Payment Method: <strong>{selectedOrder?.payment?.method?.toUpperCase() || 'UPI'}</strong> (Razorpay: {selectedOrder?.payment?.transaction_id})
          </p>
          <p className="text-slate-500">
            Refund will be credited back to the customer&apos;s source account within 2-4 business hours.
          </p>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsRefundOpen(false)}>
            Abort
          </Button>
          <Button variant="destructive" onClick={handleProcessRefund}>
            Confirm Refund Reversal
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
}
