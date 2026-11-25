'use client';

import * as React from 'react';
import {
  Store as StoreIcon,
  Plus,
  MapPin,
  Phone,
  Mail,
  Building,
  CheckCircle2,
  Users,
  IndianRupee,
  Package,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Store } from '@/types/database';
import { DataStore } from '@/lib/data-store';
import { useAppStore } from '@/store';
import { toast } from 'sonner';

export default function StoresPage() {
  const { currentStore, setCurrentStore } = useAppStore();
  const [stores, setStores] = React.useState<Store[]>([]);
  const [isCreateOpen, setIsCreateOpen] = React.useState(false);

  const [formData, setFormData] = React.useState({
    name: '',
    code: '',
    address: '',
    phone: '',
    email: '',
    gstin: '',
    is_active: true,
  });

  const loadData = () => {
    setStores(DataStore.getStores());
  };

  React.useEffect(() => {
    loadData();
  }, []);

  const handleCreateStore = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    DataStore.addStore({
      ...formData,
      code: formData.code.toUpperCase() || `PGO-OUT-${Math.floor(10 + Math.random() * 90)}`,
    });

    toast.success(`Store outlet "${formData.name}" added to peNgo network!`);
    setIsCreateOpen(false);
    loadData();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <StoreIcon className="h-6 w-6 text-red-600" />
            Multi-Store Retail Network
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Centrally govern regional branches, store-specific managers, turnstiles and regional GST numbers.
          </p>
        </div>

        <Button
          onClick={() => {
            const rand = Math.floor(10 + Math.random() * 90);
            setFormData({
              name: '',
              code: `PGO-BR-${rand}`,
              address: '',
              phone: '+91 11 4000 0000',
              email: 'outlet@pengo.retail',
              gstin: `07BBBBB0000B${rand}Z1`,
              is_active: true,
            });
            setIsCreateOpen(true);
          }}
          className="bg-red-600 hover:bg-red-700 text-white gap-1.5 h-9 text-xs font-semibold"
        >
          <Plus className="h-4 w-4" />
          Add Store Branch
        </Button>
      </div>

      {/* Grid of Stores */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {stores.map((store) => {
          const isSelected = currentStore === store.id;

          return (
            <Card
              key={store.id}
              className={`transition-all hover:shadow-lg ${
                isSelected ? 'border-2 border-red-600 ring-2 ring-red-500/20' : ''
              }`}
            >
              <CardHeader className="flex flex-row items-start justify-between pb-2">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-base font-bold">{store.name}</CardTitle>
                    {isSelected && (
                      <Badge variant="default" className="bg-red-600 text-[10px]">
                        Active In Console
                      </Badge>
                    )}
                  </div>
                  <CardDescription className="font-mono text-xs text-red-600 dark:text-red-400 font-semibold">
                    {store.code}
                  </CardDescription>
                </div>
                <Badge variant={store.is_active ? 'success' : 'outline'} className="text-[10px]">
                  {store.is_active ? 'Operational' : 'Closed'}
                </Badge>
              </CardHeader>

              <CardContent className="space-y-3 pt-2 text-xs">
                <div className="flex items-start gap-2 text-slate-600 dark:text-slate-400">
                  <MapPin className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
                  <span>{store.address}</span>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <Phone className="h-3.5 w-3.5" />
                    <span>{store.phone || 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Building className="h-3.5 w-3.5" />
                    <span className="font-mono text-[11px] truncate">{store.gstin || 'GST Registered'}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <Button
                    variant={isSelected ? 'secondary' : 'outline'}
                    size="sm"
                    onClick={() => {
                      setCurrentStore(store.id);
                      toast.success(`Switched active command context to ${store.name}`);
                    }}
                    className="w-full text-xs font-semibold"
                  >
                    {isSelected ? '✓ Currently Managing This Outlet' : 'Switch Context to This Outlet'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* CREATE STORE MODAL */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogHeader>
          <DialogTitle>Add New Store Outlet</DialogTitle>
          <DialogDescription>
            Register a physical retail location for self-checkout deployment.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleCreateStore} className="space-y-3 text-xs">
          <div className="space-y-1">
            <Label className="text-xs">Store Name *</Label>
            <Input
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. peNgo South City Mall"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs">Store Code *</Label>
              <Input
                required
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                placeholder="PGO-KOL-05"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">State GSTIN</Label>
              <Input
                value={formData.gstin}
                onChange={(e) => setFormData({ ...formData, gstin: e.target.value })}
                placeholder="19AAAAA0000A1Z9"
              />
            </div>
          </div>

          <div className="space-y-1">
            <Label className="text-xs">Full Physical Address</Label>
            <Input
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="Unit #, Street, City, State, PIN"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs">Contact Phone</Label>
              <Input
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Store Email</Label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-red-600 hover:bg-red-700 text-white">
              Deploy Outlet
            </Button>
          </DialogFooter>
        </form>
      </Dialog>
    </div>
  );
}
