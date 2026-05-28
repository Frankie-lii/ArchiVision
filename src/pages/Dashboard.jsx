import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { useAuth } from '@/lib/AuthContext';
import { Link } from 'react-router-dom';
import { Wand2, FolderOpen, Image, Video, ArrowRight, Sparkles, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import StatsCard from '@/components/dashboard/StatsCard';
import RenderCard from '@/components/dashboard/RenderCard';
import { motion } from 'framer-motion';

export default function Dashboard() {
  const { user } = useAuth();
  const plan = user?.plan || 'free';
  const rendersUsed = user?.renders_used || 0;
  const rendersLimit = plan === 'free' ? 5 : null;

  const { data: renders = [], isLoading: rendersLoading } = useQuery({
    queryKey: ['renders'],
    queryFn: () => base44.entities.Render.list('-created_date', 6),
  });

  const { data: projects = [], isLoading: projectsLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: () => base44.entities.Project.list('-created_date', 50),
  });

  const completedRenders = renders.filter(r => r.status === 'completed');
  const videoRenders = renders.filter(r => r.video_url);

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl md:text-3xl font-display font-bold">
          Welcome back{user?.full_name ? `, ${user.full_name.split(' ')[0]}` : ''}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Here's what's happening with your designs
        </p>
      </motion.div>

      {/* Quick actions */}
      <div className="flex gap-3 flex-wrap">
        <Link to="/studio">
          <Button className="bg-accent text-accent-foreground hover:bg-accent/90 gap-2 shadow-lg shadow-accent/20">
            <Wand2 className="w-4 h-4" />
            New Render
          </Button>
        </Link>
        <Link to="/projects">
          <Button variant="outline" className="gap-2">
            <FolderOpen className="w-4 h-4" />
            Projects
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard 
          title="Renders" 
          value={rendersUsed}
          subtitle={rendersLimit ? `of ${rendersLimit} this month` : 'this month'}
          icon={Image}
        />
        <StatsCard 
          title="Projects" 
          value={projects.length}
          subtitle="total"
          icon={FolderOpen}
        />
        <StatsCard 
          title="Completed" 
          value={completedRenders.length}
          subtitle="renders"
          icon={TrendingUp}
        />
        <StatsCard 
          title="Videos" 
          value={videoRenders.length}
          subtitle="generated"
          icon={Video}
        />
      </div>

      {/* Upgrade banner for free users */}
      {plan === 'free' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
          <Card className="bg-primary text-primary-foreground p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="w-4 h-4" />
                <span className="text-xs font-bold tracking-wider uppercase opacity-80">Upgrade</span>
              </div>
              <h3 className="font-display text-lg font-bold">Unlock Unlimited Renders</h3>
              <p className="text-sm opacity-80 mt-1">
                Get access to all styles, video generation, and unlimited renders.
              </p>
            </div>
            <Link to="/pricing">
              <Button variant="secondary" className="gap-2 whitespace-nowrap">
                View Plans <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </Card>
        </motion.div>
      )}

      {/* Recent renders */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold">Recent Renders</h2>
          {renders.length > 0 && (
            <Link to="/projects" className="text-xs text-accent font-medium hover:underline flex items-center gap-1">
              View All <ArrowRight className="w-3 h-3" />
            </Link>
          )}
        </div>

        {rendersLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array(3).fill(0).map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="aspect-video" />
                <div className="p-3 space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-3 w-32" />
                </div>
              </Card>
            ))}
          </div>
        ) : renders.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {renders.map(render => (
              <RenderCard key={render.id} render={render} />
            ))}
          </div>
        ) : (
          <Card className="p-12 text-center">
            <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
              <Wand2 className="w-7 h-7 text-muted-foreground" />
            </div>
            <h3 className="font-bold">No renders yet</h3>
            <p className="text-sm text-muted-foreground mt-1 mb-4">
              Upload a photo and let AI transform your space
            </p>
            <Link to="/studio">
              <Button className="bg-accent text-accent-foreground hover:bg-accent/90 gap-2">
                <Wand2 className="w-4 h-4" />
                Start Creating
              </Button>
            </Link>
          </Card>
        )}
      </div>
    </div>
  );
}
