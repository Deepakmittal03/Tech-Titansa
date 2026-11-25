'use client';

import * as React from 'react';
import {
  QrCode,
  ShieldCheck,
  ShieldAlert,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ScanLine,
  User,
  ShoppingBag,
  CreditCard,
  Clock,
  Sparkles,
  ArrowRight,
  History,
  RotateCcw,
  Zap,
  Volume2,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table';
import { DataStore } from '@/lib/data-store';
import { formatCurrency, formatDateTime } from '@/lib/utils';
import { useAuthStore } from '@/store';
import { ExitPass, Order, Customer, OrderItem, Product } from '@/types/database';
import { toast } from 'sonner';

export default function ExitVerificationPage() {
  const { user } = useAuthStore();
  const [qrInput, setQrInput] = React.useState('');
  const [isVerifying, setIsVerifying] = React.useState(false);
  const [verificationResult, setVerificationResult] = React.useState<{
    status: 'idle' | 'success' | 'already_used' | 'invalid' | 'payment_pending';
    message: string;
    order?: Order & { customer?: Customer; items?: (OrderItem & { product?: Product })[] };
    exitPass?: ExitPass;
  }>({ status: 'idle', message: '' });

  const [exitPasses, setExitPasses] = React.useState<ExitPass[]>([]);

  const playSound = (type: 'success' | 'alert') => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      if (type === 'success') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(587.33, ctx.currentTime);
        osc.frequency.setValueAtTime(880, ctx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.18, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
        osc.start();
        osc.stop(ctx.currentTime + 0.35);
      } else {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(220, ctx.currentTime);
        osc.frequency.setValueAtTime(140, ctx.currentTime + 0.15);
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
        osc.start();
        osc.stop(ctx.currentTime + 0.4);
      }
    } catch (e) {}
  };

  const loadPasses = () => {
    setExitPasses(DataStore.getExitPasses());
  };

  React.useEffect(() => {
    loadPasses();
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const tokenFromUrl = params.get('token');
      if (tokenFromUrl) {
        setQrInput(tokenFromUrl);
        handleVerify(tokenFromUrl);
      }
    }
  }, []);

  const handleGenerateNewPass = () => {
    const res = DataStore.simulateCustomerCheckout();
    if (res) {
      setQrInput(res.token);
      loadPasses();
      toast.success(`Generated fresh Pass for Order ${res.order.order_number}! Click 'Verify Pass'.`);
    }
  };

  // Quick test demo tokens from active database
  const demoTokens = [
    { label: 'Unused Valid Pass (Order #9842)', token: 'PENGO-EXIT-SECURE-9842-B4K9', type: 'valid' },
    { label: 'Unused Valid Pass (Order #9843)', token: 'PENGO-EXIT-SECURE-9843-C3X7', type: 'valid' },
    { label: 'Already Used Pass (Order #9841)', token: 'PENGO-EXIT-SECURE-9841-A8F1', type: 'duplicate' },
    { label: 'Tampered / Fake Pass Token', token: 'FAKE-TOKEN-UNAUTHORIZED-9999', type: 'fake' },
  ];

  const handleVerify = (tokenToVerify?: string) => {
    const token = (tokenToVerify || qrInput).trim();
    if (!token) {
      toast.error('Please scan or enter a customer QR Exit Token');
      return;
    }

    setIsVerifying(true);

    setTimeout(() => {
      const staffName = user?.full_name || 'Ramesh Singh (Exit Officer)';
      const result = DataStore.verifyExitPass(token, staffName);

      if (result.success) {
        playSound('success');
        setVerificationResult({
          status: 'success',
          message: result.message,
          order: result.order,
          exitPass: result.exitPass,
        });
        toast.success('PASSPORT VERIFIED! Exit Authorized.');
      } else if (result.riskStatus === 'already_used') {
        playSound('alert');
        setVerificationResult({
          status: 'already_used',
          message: result.message,
          order: result.order,
          exitPass: result.exitPass,
        });
        toast.error('SECURITY WARNING: Exit pass already used!');
      } else {
        playSound('alert');
        setVerificationResult({
          status: 'invalid',
          message: result.message,
          order: result.order,
          exitPass: result.exitPass,
        });
        toast.error('INVALID QR PASS!');
      }

      setIsVerifying(false);
      loadPasses();
    }, 450);
  };

  const handleReset = () => {
    setQrInput('');
    setVerificationResult({ status: 'idle', message: '' });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <QrCode className="h-6 w-6 text-red-600" />
            peNgo Smart Exit Verification Gate
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Cryptographic single-use token validator for high-speed automated gate clearance.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs border-emerald-500 text-emerald-600 font-bold px-3 py-1">
            Gate Staff: {user?.full_name || 'Gate Officer Active'}
          </Badge>
        </div>
      </div>

      {/* Main Verification Console (2 columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: QR Scanner & Demo Simulators (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <Card className="border-red-200/80 dark:border-red-950/60 shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <ScanLine className="h-5 w-5 text-red-600 animate-pulse" />
                Live Exit Pass Scanner
              </CardTitle>
              <CardDescription>
                Scan customer screen at turnstile or enter token manually
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Virtual Scanner Viewfinder Box */}
              <div className="relative aspect-video w-full rounded-xl bg-slate-950 border-2 border-dashed border-red-500/60 flex flex-col items-center justify-center p-6 text-center overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-red-950/40 via-transparent to-transparent pointer-events-none" />

                {/* Laser scan line animation */}
                <div className="absolute top-1/2 left-4 right-4 h-0.5 bg-red-500 shadow-[0_0_12px_#ef4444] animate-bounce pointer-events-none" />

                <QrCode className="h-16 w-16 text-red-500/80 mb-2" />
                <p className="text-xs font-bold text-white tracking-wide">
                  READY FOR CUSTOMER PASS
                </p>
                <p className="text-[10px] text-slate-400 max-w-xs mt-1">
                  Point handheld 2D scanner or enter token string below
                </p>
              </div>

              {/* Input Form */}
              <div className="space-y-2">
                <div className="relative">
                  <Input
                    placeholder="Enter QR token (e.g. PENGO-EXIT-...)"
                    value={qrInput}
                    onChange={(e) => setQrInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleVerify();
                    }}
                    className="font-mono text-xs pr-20 h-10 bg-slate-50 dark:bg-slate-900"
                  />
                  <Button
                    size="sm"
                    onClick={() => handleVerify()}
                    disabled={isVerifying}
                    className="absolute right-1 top-1 h-8 text-xs bg-red-600 hover:bg-red-700 text-white font-semibold"
                  >
                    {isVerifying ? 'Checking...' : 'Verify Pass'}
                  </Button>
                </div>
              </div>

              {/* Demo Quick-Click Test Passes */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={handleGenerateNewPass}
                  className="w-full text-xs font-bold border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 gap-1.5 mb-2"
                >
                  <Zap className="h-3.5 w-3.5" />
                  Spawn New In-Store Checkout Pass
                </Button>

                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                  <Sparkles className="h-3 w-3 text-red-500" />
                  Instant Simulation Tokens (1-Click Test)
                </p>
                <div className="space-y-1.5">
                  {demoTokens.map((dt, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setQrInput(dt.token);
                        handleVerify(dt.token);
                      }}
                      className="w-full text-left p-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-red-500 transition-all flex items-center justify-between text-xs group"
                    >
                      <div className="flex flex-col">
                        <span className="font-semibold text-slate-800 dark:text-slate-200 group-hover:text-red-600">
                          {dt.label}
                        </span>
                        <span className="font-mono text-[10px] text-slate-400">
                          {dt.token}
                        </span>
                      </div>
                      <Badge
                        variant={dt.type === 'valid' ? 'success' : dt.type === 'duplicate' ? 'destructive' : 'warning'}
                        className="text-[10px]"
                      >
                        {dt.type}
                      </Badge>
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Dynamic Verification Status Screen (7 cols) */}
        <div className="lg:col-span-7">
          {verificationResult.status === 'idle' ? (
            <Card className="h-full flex flex-col items-center justify-center p-12 text-center border-dashed border-2">
              <div className="h-16 w-16 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mb-4">
                <ShieldCheck className="h-8 w-8" />
              </div>
              <h3 className="font-bold text-base text-slate-800 dark:text-slate-200">
                Awaiting Next Customer Exit Pass
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mt-1">
                Scan customer QR code on departure. The system verifies payment integrity, items, and single-use expiry in real-time.
              </p>
            </Card>
          ) : verificationResult.status === 'success' ? (
            /* GREEN SUCCESS SCREEN */
            <Card className="border-2 border-emerald-500 bg-emerald-50/20 dark:bg-emerald-950/20 shadow-xl animate-in zoom-in-95 duration-200">
              <CardContent className="p-6 space-y-6">
                {/* Huge Verified Header */}
                <div className="flex items-center justify-between p-4 rounded-xl bg-emerald-600 text-white shadow-lg shadow-emerald-600/20">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-10 w-10 text-white animate-bounce" />
                    <div>
                      <h3 className="text-xl font-black uppercase tracking-wider">
                        Exit Pass Verified
                      </h3>
                      <p className="text-xs text-emerald-100">
                        Turnstile gate unlatched. Customer cleared for departure.
                      </p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleReset}
                    className="bg-white/20 hover:bg-white/30 text-white border-white/40 text-xs"
                  >
                    Next Customer
                  </Button>
                </div>

                {/* Customer & Order Profile */}
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div className="p-3.5 rounded-lg border border-emerald-200 dark:border-emerald-800 bg-white dark:bg-slate-900">
                    <p className="text-slate-400 font-semibold uppercase text-[10px]">Customer Name</p>
                    <p className="text-base font-black text-slate-900 dark:text-slate-100 mt-0.5">
                      {verificationResult.order?.customer?.name || 'Authorized Customer'}
                    </p>
                    <p className="text-slate-500 mt-0.5">{verificationResult.order?.customer?.phone}</p>
                  </div>

                  <div className="p-3.5 rounded-lg border border-emerald-200 dark:border-emerald-800 bg-white dark:bg-slate-900">
                    <p className="text-slate-400 font-semibold uppercase text-[10px]">Total Billed Amount</p>
                    <p className="text-base font-black text-emerald-600 dark:text-emerald-400 mt-0.5">
                      {formatCurrency(verificationResult.order?.total || 0)}
                    </p>
                    <p className="text-slate-500 mt-0.5">Payment Verified via Razorpay UPI</p>
                  </div>
                </div>

                {/* Items in Cart */}
                <div className="space-y-2">
                  <p className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center justify-between">
                    <span>Authorized Bag Items ({verificationResult.order?.items?.length || 0})</span>
                    <span className="text-[11px] text-slate-500 font-mono">
                      Ref: {verificationResult.order?.order_number}
                    </span>
                  </p>

                  <div className="border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden bg-white dark:bg-slate-900">
                    <Table>
                      <TableBody>
                        {verificationResult.order?.items?.map((it) => (
                          <TableRow key={it.id}>
                            <TableCell className="text-xs font-bold text-slate-900 dark:text-slate-100">
                              {it.product?.name || 'Retail Item'}
                            </TableCell>
                            <TableCell className="text-xs text-slate-600 dark:text-slate-400">
                              Qty: <strong>{it.quantity}</strong>
                            </TableCell>
                            <TableCell className="text-xs font-mono text-right font-bold">
                              {formatCurrency(it.total_price)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>

                {/* Security Audit Footnote */}
                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-emerald-200 dark:border-emerald-900">
                  <span>Timestamp: {formatDateTime(new Date().toISOString())}</span>
                  <span className="font-semibold text-emerald-600">Single-Use Pass Token Burned</span>
                </div>
              </CardContent>
            </Card>
          ) : (
            /* RED / WARNING ALERT SCREEN */
            <Card className="border-2 border-rose-600 bg-rose-50/30 dark:bg-rose-950/20 shadow-xl animate-in zoom-in-95 duration-200">
              <CardContent className="p-6 space-y-6">
                <div className="flex items-center justify-between p-4 rounded-xl bg-rose-600 text-white shadow-lg shadow-rose-600/20">
                  <div className="flex items-center gap-3">
                    <ShieldAlert className="h-10 w-10 text-white" />
                    <div>
                      <h3 className="text-xl font-black uppercase tracking-wider">
                        Exit Denied – Turnstile Locked
                      </h3>
                      <p className="text-xs text-rose-100">
                        {verificationResult.message}
                      </p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleReset}
                    className="bg-white/20 hover:bg-white/30 text-white border-white/40 text-xs"
                  >
                    Reset Gate
                  </Button>
                </div>

                <div className="p-4 rounded-xl border border-rose-200 dark:border-rose-900 bg-white dark:bg-slate-900 space-y-3 text-xs">
                  <div className="flex items-center gap-2 text-rose-600 font-bold">
                    <AlertTriangle className="h-4 w-4" />
                    Security Incident Automatically Logged
                  </div>
                  <p className="text-slate-600 dark:text-slate-300">
                    This incident has been recorded in the central peNgo Fraud Detection module with HIGH risk severity.
                  </p>
                  {verificationResult.exitPass && (
                    <div className="p-3 rounded-lg bg-slate-100 dark:bg-slate-800 space-y-1 font-mono text-[11px]">
                      <p>Token ID: {verificationResult.exitPass.qr_token}</p>
                      <p>Originally Cleared By: {verificationResult.exitPass.verified_by || 'Staff'}</p>
                      <p>Prior Clearance Time: {verificationResult.exitPass.verified_at ? formatDateTime(verificationResult.exitPass.verified_at) : 'N/A'}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Verification History Table */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <History className="h-5 w-5 text-slate-500" />
            Gate Verification Audit Log
          </CardTitle>
          <CardDescription>
            Live audit of exit passes generated, presented and cleared at store turnstiles
          </CardDescription>
        </CardHeader>

        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>QR Token</TableHead>
                <TableHead>Order Reference</TableHead>
                <TableHead>Single-Use Status</TableHead>
                <TableHead>Gate Officer</TableHead>
                <TableHead>Verified At</TableHead>
                <TableHead>Expires At</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {exitPasses.map((pass) => (
                <TableRow key={pass.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40">
                  <TableCell className="font-mono text-xs font-bold text-slate-900 dark:text-slate-100">
                    {pass.qr_token}
                  </TableCell>

                  <TableCell className="font-mono text-xs text-slate-600 dark:text-slate-400">
                    {pass.order_id}
                  </TableCell>

                  <TableCell>
                    <Badge
                      variant={pass.is_used ? 'success' : 'outline'}
                      className="text-[10px]"
                    >
                      {pass.is_used ? 'Used / Cleared' : 'Unused (Active)'}
                    </Badge>
                  </TableCell>

                  <TableCell className="text-xs text-slate-600 dark:text-slate-400">
                    {pass.verified_by || '—'}
                  </TableCell>

                  <TableCell className="text-xs text-slate-500 whitespace-nowrap">
                    {pass.verified_at ? formatDateTime(pass.verified_at) : 'Pending Scan'}
                  </TableCell>

                  <TableCell className="text-xs text-slate-500 whitespace-nowrap">
                    {pass.expires_at ? formatDateTime(pass.expires_at) : 'N/A'}
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
