'use client';

import * as React from 'react';
import {
  Settings,
  Shield,
  CreditCard,
  Building,
  Key,
  Save,
  CheckCircle2,
  Users,
  Bell,
  Sparkles,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { INITIAL_USERS } from '@/lib/data-store';
import { toast } from 'sonner';

export default function SettingsPage() {
  const [storeName, setStoreName] = React.useState('peNgo Flagship Retail Command');
  const [currency, setCurrency] = React.useState('INR (₹)');
  const [autoExitVerification, setAutoExitVerification] = React.useState(true);
  const [antiFraudShield, setAntiFraudShield] = React.useState(true);
  const [razorpayKey, setRazorpayKey] = React.useState('rzp_live_98xK19842peNgo');
  const [webhookSecret, setWebhookSecret] = React.useState('whsec_peNgoSecureToken9842');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('System configuration saved successfully!');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Settings className="h-6 w-6 text-red-600" />
            System Architecture & Settings
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Configure payment gateways, access policies, security heuristics and brand parameters.
          </p>
        </div>

        <Button
          onClick={handleSave}
          className="bg-red-600 hover:bg-red-700 text-white gap-1.5 h-9 text-xs font-semibold"
        >
          <Save className="h-4 w-4" />
          Save All Parameters
        </Button>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="general">Store Parameters</TabsTrigger>
          <TabsTrigger value="gateways">Payment Gateway (Razorpay)</TabsTrigger>
          <TabsTrigger value="roles">Role-Based Access (RBAC)</TabsTrigger>
          <TabsTrigger value="security">Turnstile & Anti-Fraud</TabsTrigger>
        </TabsList>

        {/* Tab 1: Store Parameters */}
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-bold">Retail Environment Profile</CardTitle>
              <CardDescription>Default currency, company entity and digital bill headers</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 max-w-2xl text-xs">
              <div className="space-y-1">
                <Label className="text-xs">Organization Name</Label>
                <Input
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs">Base Currency</Label>
                  <Input value={currency} disabled className="bg-slate-50 dark:bg-slate-800" />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Timezone</Label>
                  <Input value="Asia/Kolkata (IST +5:30)" disabled className="bg-slate-50 dark:bg-slate-800" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 2: Razorpay Gateway */}
        <TabsContent value="gateways">
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-bold">Razorpay Payment Integration</CardTitle>
              <CardDescription>Secure tokenized payment webhooks for instantaneous self-checkout</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 max-w-2xl text-xs">
              <div className="space-y-1">
                <Label className="text-xs">Razorpay Key ID</Label>
                <Input
                  type="password"
                  value={razorpayKey}
                  onChange={(e) => setRazorpayKey(e.target.value)}
                  className="font-mono"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs">Webhook Signature Secret</Label>
                <Input
                  type="password"
                  value={webhookSecret}
                  onChange={(e) => setWebhookSecret(e.target.value)}
                  className="font-mono"
                />
              </div>

              <div className="p-3 rounded-lg border border-emerald-200 dark:border-emerald-900 bg-emerald-50/50 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-300">
                <p className="font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  Razorpay Webhook Handshake Active
                </p>
                <p className="text-[11px] mt-0.5">
                  Webhook listening at: <code>https://api.pengo.retail/api/webhooks/razorpay</code>
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 3: RBAC Roles */}
        <TabsContent value="roles">
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-bold">Role-Based Access Control (RBAC)</CardTitle>
              <CardDescription>
                6-tier enterprise permission matrix governing user capabilities
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                {INITIAL_USERS.map((u) => (
                  <div key={u.id} className="p-4 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-slate-900 dark:text-slate-100">{u.full_name}</p>
                      <p className="text-slate-500">{u.email}</p>
                    </div>
                    <Badge variant="secondary" className="capitalize font-semibold">
                      {(u.role || 'staff').replace('_', ' ')}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 4: Security */}
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-bold">Turnstile & Heuristic Safeguards</CardTitle>
              <CardDescription>Automated rules protecting store inventory from shrinkage</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 max-w-2xl text-xs">
              <div className="flex items-center justify-between p-3 rounded-lg border border-slate-200 dark:border-slate-800">
                <div>
                  <p className="font-bold text-slate-900 dark:text-slate-100">Single-Use Pass Token Burning</p>
                  <p className="text-[11px] text-slate-500">
                    Immediately revoke cryptographic exit pass once verified at gate scanner
                  </p>
                </div>
                <Switch
                  checked={autoExitVerification}
                  onCheckedChange={setAutoExitVerification}
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg border border-slate-200 dark:border-slate-800">
                <div>
                  <p className="font-bold text-slate-900 dark:text-slate-100">Anti-Tampering Cart Watchdog</p>
                  <p className="text-[11px] text-slate-500">
                    Flag rapid product quantity alterations right before payment screen
                  </p>
                </div>
                <Switch
                  checked={antiFraudShield}
                  onCheckedChange={setAntiFraudShield}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
