import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { useAuth } from '@/lib/AuthContext';
import { Link } from 'react-router-dom';
import { ArrowLeft, Video, Loader2, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import BeforeAfterSlider from '@/components/studio/BeforeAfterSlider';
import { format } from 'date-fns';
import { motion } from 'framer-motion';

const styleLabels = {
  modern: 'Modern', minimalist: 'Minimalist', luxury: 'Luxury',
  scandinavian: 'Scandinavian', african_contemporary: 'African Contemporary',
  industrial: 'Industrial', smart_home: 'Smart Home',
};

const roomLabels = {
  living_room: 'Living Room', bedroom: 'Bedroom', kitchen: 'Kitchen',
  bathroom: 'Bathroom', office: 'Office', dining_room: 'Dining Room',
  exterior: 'Exterior', balcony: 'Balcony',
};

export default function RenderDetail() {
  const urlParams = new URLSearchParams(window.location.search);
  const pathname = window.location.pathname;
  const renderId = pathname.split('/render/')[1];
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: render, isLoading } = useQuery({
    queryKey: ['render', renderId],
    queryFn: async () => {
      const renders = await base44.entities.Render.filter({ id: renderId });
      return renders[0];
    },
    enabled: !!renderId,
  });

  const videoMutation = useMutation({
    mutationFn: async () => {
      const prompt = `Cinematic property walkthrough video of a beautifully staged ${roomLabels[render.room_type] || 'room'} with ${styleLabels[render.style] || ''} design. Smooth camera pan revealing the space, professional real estate video, warm lighting, luxurious atmosphere.`;
      
      const { url: videoUrl } = await base44.integrations.Core.GenerateVideo({
        prompt,
        duration: 6,
        aspect_ratio: '16:9',
      });

      await base44.entities.Render.update(render.id, { video_url: videoUrl });
      return videoUrl;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['render', renderId] });
      toast.success('Video generated successfully!');
    },
    onError: () => {
      toast.error('Failed to generate video. Please try again.');
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="aspect-video w-full rounded-xl" />
      </div>
    );
  }

  if (!render) {
    return (
      <Card className="p-12 text-center">
        <p className="font-bold">Render not found</p>
        <Link to="/"><Button variant="link" className="mt-2">Back to Dashboard</Button></Link>
      </Card>
    );
  }

  const plan = user?.plan || 'free';

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      {/* Back */}
      <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Back to Dashboard
      </Link>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold">Render Detail</h1>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="secondary">{styleLabels[render.style] || render.style}</Badge>
            <Badge variant="outline">{roomLabels[render.room_type] || render.room_type}</Badge>
            <Badge variant={render.status === 'completed' ? 'default' : 'destructive'}>
              {render.status}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            {render.created_date ? format(new Date(render.created_date), 'MMMM d, yyyy • h:mm a') : ''}
          </p>
        </div>
      </div>

      {/* Before/After */}
      {render.original_image_url && render.generated_image_url && (
        <BeforeAfterSlider
          beforeUrl={render.original_image_url}
          afterUrl={render.generated_image_url}
        />
      )}

      {/* Video section */}
      <Card className="p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-bold text-sm">Video Walkthrough</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Generate a cinematic video tour of this space
            </p>
          </div>
          {!render.video_url && plan !== 'free' && (
            <Button
              onClick={() => videoMutation.mutate()}
              disabled={videoMutation.isPending}
              size="sm"
              className="bg-accent text-accent-foreground hover:bg-accent/90 gap-2"
            >
              {videoMutation.isPending ? (
                <>
                  <Loader2 className="w-3 h-3 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Video className="w-3 h-3" />
                  Generate Video
                </>
              )}
            </Button>
          )}
          {plan === 'free' && !render.video_url && (
            <Link to="/pricing">
              <Button size="sm" variant="outline" className="gap-2">
                Upgrade for Video
              </Button>
            </Link>
          )}
        </div>

        {render.video_url ? (
          <div className="rounded-xl overflow-hidden border">
            <video
              src={render.video_url}
              controls
              className="w-full aspect-video bg-black"
            />
          </div>
        ) : videoMutation.isPending ? (
          <div className="aspect-video rounded-xl bg-muted flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-accent" />
            <p className="text-sm font-medium">Generating video walkthrough...</p>
            <p className="text-xs text-muted-foreground">This can take 30-60 seconds</p>
          </div>
        ) : (
          <div className="aspect-video rounded-xl bg-muted/50 border-2 border-dashed flex items-center justify-center">
            <div className="text-center">
              <Video className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">No video generated yet</p>
            </div>
          </div>
        )}
      </Card>
    </motion.div>
  );
}
