import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Plus, FolderOpen, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import RenderCard from '@/components/dashboard/RenderCard';
import { motion } from 'framer-motion';
import { format } from 'date-fns';

export default function Projects() {
  const queryClient = useQueryClient();
  const [showCreate, setShowCreate] = useState(false);
  const [search, setSearch] = useState('');
  const [newProject, setNewProject] = useState({ name: '', property_address: '', description: '' });

  const { data: projects = [], isLoading: projectsLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: () => base44.entities.Project.list('-created_date'),
  });

  const { data: renders = [], isLoading: rendersLoading } = useQuery({
    queryKey: ['all-renders'],
    queryFn: () => base44.entities.Render.list('-created_date'),
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.Project.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      setShowCreate(false);
      setNewProject({ name: '', property_address: '', description: '' });
      toast.success('Project created');
    },
  });

  const filteredRenders = search
    ? renders.filter(r =>
        r.style?.toLowerCase().includes(search.toLowerCase()) ||
        r.room_type?.toLowerCase().includes(search.toLowerCase())
      )
    : renders;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-bold">Projects</h1>
          <p className="text-sm text-muted-foreground mt-1">Organize and browse your renders</p>
        </div>
        <Button onClick={() => setShowCreate(true)} className="bg-accent text-accent-foreground hover:bg-accent/90 gap-2">
          <Plus className="w-4 h-4" />
          New Project
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search renders..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Projects list */}
      {projects.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map(project => (
            <Card key={project.id} className="p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                  <FolderOpen className="w-5 h-5 text-accent" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold text-sm truncate">{project.name}</h3>
                  {project.property_address && (
                    <p className="text-xs text-muted-foreground truncate">{project.property_address}</p>
                  )}
                  <p className="text-[10px] text-muted-foreground mt-1">
                    {project.created_date ? format(new Date(project.created_date), 'MMM d, yyyy') : ''}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* All renders grid */}
      <div>
        <h2 className="text-lg font-bold mb-4">All Renders</h2>
        {rendersLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array(6).fill(0).map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="aspect-video" />
                <div className="p-3 space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-32" />
                </div>
              </Card>
            ))}
          </div>
        ) : filteredRenders.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredRenders.map(render => (
              <RenderCard key={render.id} render={render} />
            ))}
          </div>
        ) : (
          <Card className="p-12 text-center">
            <FolderOpen className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
            <h3 className="font-bold">No renders found</h3>
            <p className="text-sm text-muted-foreground mt-1">
              {search ? 'Try a different search term' : 'Head to the Studio to create your first render'}
            </p>
          </Card>
        )}
      </div>

      {/* Create project dialog */}
      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Project</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Project Name</Label>
              <Input
                value={newProject.name}
                onChange={(e) => setNewProject(p => ({ ...p, name: e.target.value }))}
                placeholder="e.g., Westlands Apartment"
              />
            </div>
            <div>
              <Label>Property Address</Label>
              <Input
                value={newProject.property_address}
                onChange={(e) => setNewProject(p => ({ ...p, property_address: e.target.value }))}
                placeholder="e.g., 123 Moi Avenue, Nairobi"
              />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea
                value={newProject.description}
                onChange={(e) => setNewProject(p => ({ ...p, description: e.target.value }))}
                placeholder="Brief description..."
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreate(false)}>Cancel</Button>
            <Button
              onClick={() => createMutation.mutate(newProject)}
              disabled={!newProject.name || createMutation.isPending}
              className="bg-accent text-accent-foreground hover:bg-accent/90"
            >
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
