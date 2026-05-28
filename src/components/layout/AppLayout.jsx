import { Outlet, Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { 
  LayoutDashboard, Wand2, FolderOpen, CreditCard, 
  Menu, X, LogOut, ChevronRight, Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { base44 } from '@/api/base44Client';
import { useAuth } from '@/lib/AuthContext';

const navItems = [
  { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/studio', icon: Wand2, label: 'AI Studio' },
  { path: '/projects', icon: FolderOpen, label: 'Projects' },
  { path: '/pricing', icon: CreditCard, label: 'Pricing' },
];

export default function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const { user } = useAuth();

  const plan = user?.plan || 'free';
  const rendersUsed = user?.renders_used || 0;
  const rendersLimit = plan === 'free' ? 5 : null;

  return (
    <div className="min-h-screen flex bg-background">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:sticky top-0 left-0 z-50 h-screen w-64 bg-sidebar text-sidebar-foreground
        flex flex-col transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Logo */}
        <div className="p-6 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-sidebar-primary flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-sidebar-primary-foreground" />
          </div>
          <div>
            <h1 className="font-display text-lg font-bold text-sidebar-foreground">ArchiVision</h1>
            <p className="text-[10px] tracking-[0.2em] uppercase text-sidebar-foreground/50">AI Studio</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 mt-4 space-y-1">
          {navItems.map(item => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all
                  ${isActive 
                    ? 'bg-sidebar-accent text-sidebar-primary' 
                    : 'text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent/50'}
                `}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
                {isActive && <ChevronRight className="w-3 h-3 ml-auto" />}
              </Link>
            );
          })}
        </nav>

        {/* Usage card */}
        <div className="p-3 mx-3 mb-3 rounded-lg bg-sidebar-accent/50">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-sidebar-foreground/70">Renders Used</span>
            <span className="text-xs font-bold text-sidebar-primary">
              {rendersUsed}{rendersLimit ? ` / ${rendersLimit}` : ''}
            </span>
          </div>
          {rendersLimit && (
            <div className="w-full h-1.5 bg-sidebar-border rounded-full overflow-hidden">
              <div 
                className="h-full bg-sidebar-primary rounded-full transition-all"
                style={{ width: `${Math.min((rendersUsed / rendersLimit) * 100, 100)}%` }}
              />
            </div>
          )}
          <p className="text-[10px] text-sidebar-foreground/40 mt-1.5 capitalize">{plan} Plan</p>
        </div>

        {/* User */}
        <div className="p-3 border-t border-sidebar-border">
          <div className="flex items-center gap-3 px-2">
            <div className="w-8 h-8 rounded-full bg-sidebar-primary/20 flex items-center justify-center text-xs font-bold text-sidebar-primary">
              {user?.full_name?.[0] || user?.email?.[0]?.toUpperCase() || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium truncate">{user?.full_name || 'User'}</p>
              <p className="text-[10px] text-sidebar-foreground/40 truncate">{user?.email}</p>
            </div>
            <button 
              onClick={() => base44.auth.logout()} 
              className="p-1.5 rounded-md hover:bg-sidebar-accent text-sidebar-foreground/40 hover:text-sidebar-foreground transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 min-h-screen">
        {/* Mobile header */}
        <div className="lg:hidden sticky top-0 z-30 bg-background/80 backdrop-blur-lg border-b px-4 py-3 flex items-center gap-3">
          <button onClick={() => setSidebarOpen(true)} className="p-1.5">
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-accent" />
            <span className="font-display font-bold text-sm">ArchiVision AI</span>
          </div>
        </div>
        
        <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
