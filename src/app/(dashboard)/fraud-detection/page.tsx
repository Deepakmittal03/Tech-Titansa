'use client';

import * as React from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  AlertOctagon,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  Sparkles,
  Eye,
  FileText,
  User,
  Store as StoreIcon,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table';
import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { DataStore, FraudAlert } from '@/lib/data-store';
import { formatDateTime } from '@/lib/utils';
import { toast } from 'sonner';

export default function FraudDetectionPage() {
  const [alerts, setAlerts] = React.useState<FraudAlert[]>([]);
  const [riskFilter, setRiskFilter] = React.useState<'all' | 'high' | 'medium' | 'low'>('all');
  const [selectedAlert, setSelectedAlert] = React.useState<FraudAlert | null>(null);
  const [isDetailOpen, setIsDetailOpen] = React.useState(false);

  const loadData = () => {
    setAlerts(DataStore.getFraudAlerts());
  };

  React.useEffect(() => {
    loadData();
  }, []);

  const handleUpdateStatus = (alertId: string, newStatus: FraudAlert['status']) => {
    const updated = alerts.map((a) => (a.id === alertId ? { ...a, status: newStatus } : a));
    setAlerts(updated);
    toast.success(`Security incident marked as ${newStatus.replace('_', ' ').toUpperCase()}`);
    setIsDetailOpen(false);
  };

  const filteredAlerts = alerts.filter((a) => {
    if (riskFilter === 'all') return true;
    return a.risk_level === riskFilter;
  });

  const highRiskCount = alerts.filter((a) => a.risk_level === 'high').length;
  const mediumRiskCount = alerts.filter((a) => a.risk_level === 'medium').length;
  const lowRiskCount = alerts.filter((a) => a.risk_level === 'low').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <ShieldAlert className="h-6 w-6 text-red-600" />
            Fraud Detection & Risk Monitoring
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Real-time heuristic anomaly detection preventing cart tampering, duplicate exit pass fraud & barcode spoofing.
          </p>
        </div>

        <Badge variant="outline" className="text-xs border-red-500 text-red-600 font-bold px-3 py-1">
          Active Guardrails: 8 Neural Policies
        </Badge>
      </div>

      {/* Security Threat Severity Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* High Risk */}
        <div
          onClick={() => setRiskFilter('high')}
          className={`cursor-pointer p-4 rounded-xl border transition-all ${
            riskFilter === 'high'
              ? 'bg-rose-50 border-rose-500 dark:bg-rose-950/40'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-rose-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-rose-700 dark:text-rose-400 uppercase tracking-wider">
              High Severity Threats
            </span>
            <AlertOctagon className="h-4 w-4 text-rose-600" />
          </div>
          <div className="text-2xl font-black text-rose-600 dark:text-rose-400 mt-1">
            {highRiskCount} Incidents
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5">Duplicate pass reuse & tampered tokens</p>
        </div>

        {/* Medium Risk */}
        <div
          onClick={() => setRiskFilter('medium')}
          className={`cursor-pointer p-4 rounded-xl border transition-all ${
            riskFilter === 'medium'
              ? 'bg-amber-50 border-amber-500 dark:bg-amber-950/40'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-amber-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider">
              Medium Risk Anomalies
            </span>
            <AlertTriangle className="h-4 w-4 text-amber-600" />
          </div>
          <div className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-1">
            {mediumRiskCount} Incidents
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5">Abnormal cart quantity drops & rapid deletions</p>
        </div>

        {/* Low Risk */}
        <div
          onClick={() => setRiskFilter('low')}
          className={`cursor-pointer p-4 rounded-xl border transition-all ${
            riskFilter === 'low'
              ? 'bg-sky-50 border-sky-500 dark:bg-sky-950/40'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-sky-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-sky-700 dark:text-sky-400 uppercase tracking-wider">
              Low Severity Flags
            </span>
            <ShieldCheck className="h-4 w-4 text-sky-600" />
          </div>
          <div className="text-2xl font-black text-sky-600 dark:text-sky-400 mt-1">
            {lowRiskCount} Incidents
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5">Unrecognized barcode camera retries</p>
        </div>
      </div>

      {/* Security Incident Log Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <div>
            <CardTitle className="text-base font-bold">Live Security Incident Feed</CardTitle>
            <CardDescription>
              Flagged transactions queued for human supervisor audit rather than automatic false accusations
            </CardDescription>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setRiskFilter('all')}
            className="text-xs"
          >
            Show All Severities
          </Button>
        </CardHeader>

        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Risk Severity</TableHead>
                <TableHead>Anomaly Type</TableHead>
                <TableHead>Description & Store Outlet</TableHead>
                <TableHead>Customer / Order Ref</TableHead>
                <TableHead>Resolution Status</TableHead>
                <TableHead>Incident Timestamp</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAlerts.map((alert) => (
                <TableRow key={alert.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40">
                  <TableCell>
                    <Badge
                      variant={alert.risk_level === 'high' ? 'destructive' : alert.risk_level === 'medium' ? 'warning' : 'info'}
                      className="text-[10px] uppercase font-bold"
                    >
                      {alert.risk_level}
                    </Badge>
                  </TableCell>

                  <TableCell className="font-bold text-xs text-slate-900 dark:text-slate-100">
                    {alert.title}
                  </TableCell>

                  <TableCell className="text-xs text-slate-600 dark:text-slate-300 max-w-md">
                    {alert.description}
                  </TableCell>

                  <TableCell>
                    <div className="flex flex-col text-xs font-mono">
                      <span>{alert.order_id || 'N/A'}</span>
                      <span className="text-[11px] text-slate-400 font-sans">{alert.customer_name || 'Anonymous'}</span>
                    </div>
                  </TableCell>

                  <TableCell>
                    <Badge
                      variant={alert.status === 'resolved' ? 'success' : alert.status === 'dismissed' ? 'outline' : 'warning'}
                      className="text-[10px] capitalize"
                    >
                      {alert.status.replace('_', ' ')}
                    </Badge>
                  </TableCell>

                  <TableCell className="text-xs text-slate-500 whitespace-nowrap">
                    {formatDateTime(alert.created_at)}
                  </TableCell>

                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedAlert(alert);
                        setIsDetailOpen(true);
                      }}
                      className="h-8 text-xs gap-1"
                    >
                      Audit
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* SECURITY AUDIT MODAL */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-rose-600">
            <ShieldAlert className="h-5 w-5" />
            Security Incident Review Dossier
          </DialogTitle>
          <DialogDescription>
            Examine forensic logs before taking administrative action.
          </DialogDescription>
        </DialogHeader>

        {selectedAlert && (
          <div className="space-y-4 py-2 text-xs">
            <div className="p-4 rounded-xl border border-rose-200 dark:border-rose-900 bg-rose-50/40 dark:bg-rose-950/20 space-y-2">
              <div className="flex items-center justify-between">
                <Badge variant={selectedAlert.risk_level === 'high' ? 'destructive' : 'warning'} className="uppercase">
                  {selectedAlert.risk_level} Priority
                </Badge>
                <span className="text-slate-500">{formatDateTime(selectedAlert.created_at)}</span>
              </div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                {selectedAlert.title}
              </h3>
              <p className="text-slate-600 dark:text-slate-300">
                {selectedAlert.description}
              </p>
            </div>

            <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 space-y-1.5">
              <p className="font-semibold text-slate-700 dark:text-slate-300">Forensic Metadata:</p>
              <p className="text-slate-500">Associated Order: {selectedAlert.order_id || 'Not Associated'}</p>
              <p className="text-slate-500">Shopper Identity: {selectedAlert.customer_name || 'Guest Device'}</p>
              <p className="text-slate-500">Store Outlet: Connaught Place Flagship (Gate 2)</p>
            </div>

            <p className="text-[11px] text-slate-400 italic">
              Note: Under peNgo operational guidelines, customer accounts are not barred automatically to avoid wrongful accusation of accidental rescans.
            </p>
          </div>
        )}

        <DialogFooter className="gap-2 sm:gap-2">
          <Button
            variant="outline"
            onClick={() => selectedAlert && handleUpdateStatus(selectedAlert.id, 'dismissed')}
          >
            Dismiss as False Positive
          </Button>
          <Button
            className="bg-emerald-600 hover:bg-emerald-700 text-white"
            onClick={() => selectedAlert && handleUpdateStatus(selectedAlert.id, 'resolved')}
          >
            Mark Investigated & Resolved
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
}
