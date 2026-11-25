'use client';

import * as React from 'react';
import {
  FileSpreadsheet,
  Download,
  Calendar,
  FileText,
  TrendingUp,
  Receipt,
  Boxes,
  Users,
  CheckCircle2,
  Printer,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DataStore } from '@/lib/data-store';
import { downloadAsCSV, downloadAsPDF, formatCurrency } from '@/lib/utils';
import { toast } from 'sonner';

interface ReportTemplate {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  type: string;
  frequency: string;
}

const REPORT_TEMPLATES: ReportTemplate[] = [
  {
    id: 'rep-daily-sales',
    title: 'Daily Gross Checkout & Sales Report',
    description: 'Itemized breakdown of all customer mobile self-checkouts, digital receipts and payment methods.',
    icon: TrendingUp,
    type: 'Financial',
    frequency: 'Daily',
  },
  {
    id: 'rep-gst-tax',
    title: 'GST Tax Remittance & HSN Summary',
    description: 'Central and state tax audit broken down by 5%, 12%, 18% slabs for monthly filing.',
    icon: Receipt,
    type: 'Tax & Compliance',
    frequency: 'Monthly',
  },
  {
    id: 'rep-inventory-audit',
    title: 'Stock Ledger & Shelf Discrepancy Audit',
    description: 'Real-time stock valuation, depletion rates, low threshold alerts and batch expiry schedules.',
    icon: Boxes,
    type: 'Operations',
    frequency: 'Weekly',
  },
  {
    id: 'rep-exit-verification',
    title: 'Smart Exit Pass & Gate Security Audit',
    description: 'Log of all generated single-use QR passes, verification timestamps, gate staff and blocked duplicate passes.',
    icon: CheckCircle2,
    type: 'Security',
    frequency: 'Real-Time',
  },
  {
    id: 'rep-customer-ltv',
    title: 'Customer Lifetime Value & Loyalty Report',
    description: 'Shopper retention cohorts, average basket spend, purchase frequency and loyalty points ledger.',
    icon: Users,
    type: 'Marketing',
    frequency: 'Monthly',
  },
];

export default function ReportsPage() {
  const [downloadingId, setDownloadingId] = React.useState<string | null>(null);

  const handleDownloadCSV = (template: ReportTemplate) => {
    setDownloadingId(template.id);
    setTimeout(() => {
      if (template.id === 'rep-daily-sales') {
        const orders = DataStore.getOrders();
        const data = orders.map((o) => ({
          OrderNumber: o.order_number,
          Customer: o.customer?.name || 'Shopper',
          Subtotal: o.subtotal,
          Tax: o.tax,
          Discount: o.discount,
          Total: o.total,
          Payment: o.payment?.method || 'UPI',
          Status: o.status,
          Date: o.created_at,
        }));
        downloadAsCSV(data, 'peNgo-Daily-Sales-Report');
      } else if (template.id === 'rep-inventory-audit') {
        const inv = DataStore.getInventory();
        const data = inv.map((i) => ({
          Product: i.product?.name,
          SKU: i.product?.sku,
          Barcode: i.product?.barcode,
          Quantity: i.quantity,
          MinThreshold: i.min_threshold,
          Batch: i.batch_number,
          Expiry: i.expiry_date,
        }));
        downloadAsCSV(data, 'peNgo-Inventory-Audit-Ledger');
      } else if (template.id === 'rep-exit-verification') {
        const passes = DataStore.getExitPasses();
        const data = passes.map((p) => ({
          Token: p.qr_token,
          OrderID: p.order_id,
          Used: p.is_used ? 'YES' : 'NO',
          VerifiedBy: p.verified_by || 'Pending',
          VerifiedAt: p.verified_at || 'Pending',
        }));
        downloadAsCSV(data, 'peNgo-Exit-Verification-Audit');
      } else {
        const customers = DataStore.getCustomers();
        const data = customers.map((c) => ({
          Name: c.name,
          Email: c.email,
          Purchases: c.total_purchases,
          TotalSpent: c.total_spent,
          LoyaltyPoints: c.loyalty_points,
          Segment: c.segment,
        }));
        downloadAsCSV(data, 'peNgo-Customer-Analytics');
      }

      setDownloadingId(null);
      toast.success(`${template.title} exported as CSV`);
    }, 400);
  };

  const handleDownloadPDF = (template: ReportTemplate) => {
    setDownloadingId(template.id);
    setTimeout(() => {
      const sampleData = [
        ['Store Metric', 'Connaught Place', 'CyberHub', 'Indiranagar', 'Powai'],
        ['Gross Sales', '₹1,24,500', '₹98,400', '₹1,12,000', '₹86,500'],
        ['Self-Checkouts', '342', '265', '298', '215'],
        ['Exit Gate Scans', '342', '265', '298', '215'],
        ['Avg Basket Value', '₹364', '₹371', '₹375', '₹402'],
      ];
      downloadAsPDF(sampleData, template.title, `peNgo-${template.id}`);
      setDownloadingId(null);
      toast.success(`${template.title} exported as PDF`);
    }, 400);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <FileSpreadsheet className="h-6 w-6 text-red-600" />
            Executive Reports & Financial Audits
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Generate certified compliance statements, sales journals, tax remittances and stock audits.
          </p>
        </div>
      </div>

      {/* Grid of Report Cards */}
      <div className="space-y-4">
        {REPORT_TEMPLATES.map((rep) => {
          const Icon = rep.icon;
          const isDownloading = downloadingId === rep.id;

          return (
            <Card key={rep.id} className="hover:border-red-500/50 transition-all">
              <CardContent className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600 dark:bg-red-950/60 dark:text-red-400 font-bold">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-slate-100">
                        {rep.title}
                      </h3>
                      <Badge variant="secondary" className="text-[10px]">
                        {rep.frequency}
                      </Badge>
                      <Badge variant="outline" className="text-[10px]">
                        {rep.type}
                      </Badge>
                    </div>
                    <p className="text-xs text-slate-500 mt-1 max-w-2xl">
                      {rep.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDownloadCSV(rep)}
                    disabled={isDownloading}
                    className="h-8 gap-1.5 text-xs"
                  >
                    <Download className="h-3.5 w-3.5" />
                    CSV Spreadsheet
                  </Button>

                  <Button
                    size="sm"
                    onClick={() => handleDownloadPDF(rep)}
                    disabled={isDownloading}
                    className="h-8 gap-1.5 text-xs bg-red-600 hover:bg-red-700 text-white"
                  >
                    <Printer className="h-3.5 w-3.5" />
                    PDF Document
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
