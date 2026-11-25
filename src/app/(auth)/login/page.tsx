'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Lock, Mail, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { useAuthStore } from '@/store';
import { INITIAL_USERS } from '@/lib/data-store';
import { toast } from 'sonner';

export default function LoginPage() {
  const router = useRouter();
  const { setUser, setRole } = useAuthStore();
  const [email, setEmail] = React.useState('admin@pengo.retail');
  const [password, setPassword] = React.useState('••••••••••••');
  const [isLoading, setIsLoading] = React.useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      const foundUser = INITIAL_USERS.find((u) => u.email.toLowerCase() === email.toLowerCase()) || INITIAL_USERS[0];
      setUser(foundUser);
      const userRole = foundUser.role || 'super_admin';
      setRole(userRole);
      toast.success(`Welcome back, ${foundUser.full_name}!`, {
        description: `Signed in as ${userRole.replace('_', ' ').toUpperCase()}`,
      });
      router.push('/dashboard');
    }, 600);
  };

  const handleQuickRoleSelect = (userIndex: number) => {
    const selected = INITIAL_USERS[userIndex];
    setEmail(selected.email);
    setPassword('demoPass2024');
    setUser(selected);
    const selectedRole = selected.role || 'super_admin';
    setRole(selectedRole);
    toast.info(`Switched demo profile to ${selectedRole.replace('_', ' ').toUpperCase()}`);
  };

  return (
    <Card className="border-slate-800 bg-slate-900/90 text-white backdrop-blur-xl shadow-2xl">
      <CardHeader className="space-y-2 text-center pb-6">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-600 shadow-lg shadow-red-600/30 font-black text-2xl text-white">
          p<span className="text-white font-extrabold">N</span>
        </div>
        <CardTitle className="text-2xl font-black tracking-tight text-white">
          pe<span className="text-red-500">N</span>go
        </CardTitle>
        <CardDescription className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
          Smart Retail Command Center
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Quick Role Tester Pills for Hackathon / Evaluation */}
        <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
            <Sparkles className="h-3 w-3 text-red-500" />
            Instant Role Switcher (Demo Mode)
          </p>
          <div className="grid grid-cols-2 gap-1.5 text-xs">
            {INITIAL_USERS.map((u, i) => (
              <button
                key={u.id}
                type="button"
                onClick={() => handleQuickRoleSelect(i)}
                className={`text-left px-2.5 py-1.5 rounded-md text-[11px] transition-all truncate border ${
                  email === u.email
                    ? 'bg-red-600/20 border-red-500/50 text-red-300 font-bold'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                }`}
              >
                {(u.role || 'Admin').replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-xs text-slate-300">
              Retail Operator Email
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@pengo.retail"
                required
                className="pl-9 bg-slate-950 border-slate-800 text-white placeholder:text-slate-600 focus-visible:ring-red-500 focus-visible:border-red-500"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-xs text-slate-300">
                Password
              </Label>
              <Link
                href="/forgot-password"
                className="text-xs text-red-400 hover:underline"
              >
                Forgot?
              </Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="pl-9 bg-slate-950 border-slate-800 text-white placeholder:text-slate-600 focus-visible:ring-red-500 focus-visible:border-red-500"
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2.5 h-10 shadow-lg shadow-red-600/20"
          >
            {isLoading ? (
              'Authenticating...'
            ) : (
              <span className="flex items-center justify-center gap-2">
                Authorize & Enter Console
                <ArrowRight className="h-4 w-4" />
              </span>
            )}
          </Button>
        </form>
      </CardContent>

      <CardFooter className="flex flex-col items-center gap-2 border-t border-slate-800/80 pt-4 text-center">
        <p className="text-[11px] text-slate-500 flex items-center gap-1.5">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
          End-to-End Encrypted Session • TLS 1.3
        </p>
      </CardFooter>
    </Card>
  );
}
