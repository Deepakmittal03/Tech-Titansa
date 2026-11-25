import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '@/types/database';

// ─── Auth Store ────────────────────────────────────────────────────────────────

interface AuthState {
  user: User | null;
  role: string | null;
  permissions: string[];
  isLoading: boolean;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  setRole: (role: string | null) => void;
  setPermissions: (permissions: string[]) => void;
  clearAuth: () => void;
  initialize: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  role: null,
  permissions: [],
  isLoading: true,
  isAuthenticated: false,

  setUser: (user) =>
    set({ user, isAuthenticated: !!user, isLoading: false }),

  setRole: (role) => set({ role }),

  setPermissions: (permissions) => set({ permissions }),

  clearAuth: () =>
    set({
      user: null,
      role: null,
      permissions: [],
      isAuthenticated: false,
      isLoading: false,
    }),

  initialize: () => set({ isLoading: true }),
}));

// ─── App Store ─────────────────────────────────────────────────────────────────

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  createdAt: string;
}

interface AppState {
  sidebarOpen: boolean;
  currentStore: string;
  theme: 'light' | 'dark';
  notifications: Notification[];
  setSidebarOpen: (open: boolean) => void;
  setCurrentStore: (storeId: string) => void;
  setTheme: (theme: 'light' | 'dark') => void;
  addNotification: (notification: Omit<Notification, 'id' | 'read' | 'createdAt'>) => void;
  removeNotification: (id: string) => void;
  markNotificationRead: (id: string) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      sidebarOpen: true,
      currentStore: 'all',
      theme: 'light',
      notifications: [],

      setSidebarOpen: (open) => set({ sidebarOpen: open }),

      setCurrentStore: (storeId) => set({ currentStore: storeId }),

      setTheme: (theme) => set({ theme }),

      addNotification: (notification) =>
        set((state) => ({
          notifications: [
            ...state.notifications,
            {
              ...notification,
              id: crypto.randomUUID(),
              read: false,
              createdAt: new Date().toISOString(),
            },
          ],
        })),

      removeNotification: (id) =>
        set((state) => ({
          notifications: state.notifications.filter((n) => n.id !== id),
        })),

      markNotificationRead: (id) =>
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, read: true } : n
          ),
        })),
    }),
    {
      name: 'pengo-admin-app',
      partialize: (state) => ({ theme: state.theme }),
    }
  )
);

// ─── Dashboard Store ───────────────────────────────────────────────────────────

interface DateRange {
  from: string;
  to: string;
}

interface KpiData {
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
  newCustomers: number;
  [key: string]: number;
}

interface DashboardState {
  dateRange: DateRange;
  selectedStore: string | null;
  kpiData: KpiData | null;
  isLoading: boolean;
  setDateRange: (range: DateRange) => void;
  setSelectedStore: (storeId: string | null) => void;
  refreshDashboard: () => void;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  dateRange: {
    from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    to: new Date().toISOString().split('T')[0],
  },
  selectedStore: null,
  kpiData: null,
  isLoading: false,

  setDateRange: (range) => set({ dateRange: range }),

  setSelectedStore: (storeId) => set({ selectedStore: storeId }),

  refreshDashboard: () => set({ isLoading: true, kpiData: null }),
}));
