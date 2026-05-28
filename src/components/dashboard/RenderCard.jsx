import { format } from 'date-fns';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Eye, Video, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const styleLabels = {
  modern: 'Modern',
  minimalist: 'Minimalist',
  luxury: 'Luxury',
  scandinavian: 'Scandinavian',
  african_contemporary: 'African',
  industrial: 'Industrial',
  smart_home: 'Smart Home',
};

const roomLabels = {
  living_room: 'Living Room',
  bedroom: 'Bedroom',
  kitchen: 'Kitchen',
  bathroom: 'Bathroom',
  office: 'Office',
  dining_room: 'Dining Room',
  exterior: 'Exterior',
  balcony: 'Balcony',
};

export default function RenderCard({ render }) {
  const imageUrl = render.generated_image_url || render.original_image_url;
  const isProcessing = render.status === 'processing';

  return (
    <Link to={`/render/${render.id}`}>
      <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer">
        <div className="relative aspect-video bg-muted">
          {imageUrl ? (
            <img 
              src={imageUrl} 
              alt="Render" 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          )}
          
          {isProcessing && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-sm">
                <Loader2 className="w-3 h-3 animate-spin text-white" />
                <span className="text-xs text-white font-medium">Processing</span>
              </div>
            </div>
          )}

          {render.video_url && (
            <div className="absolute bottom-2 right-2 p-1.5 rounded-full bg-black/60">
              <Video className="w-3 h-3 text-white" />
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
            <div className="flex items-center gap-1 text-white">
              <Eye className="w-3 h-3" />
              <span className="text-xs">View</span>
            </div>
          </div>
        </div>

        <div className="p-3">
          <div className="flex items-center gap-1.5 flex-wrap">
            <Badge variant="secondary" className="text-[10px] px-1.5 py-0.5">
              {styleLabels[render.style] || render.style}
            </Badge>
            <Badge variant="outline" className="text-[10px] px-1.5 py-0.5">
              {roomLabels[render.room_type] || render.room_type}
            </Badge>
          </div>
          <p className="text-[10px] text-muted-foreground mt-2">
            {render.created_date ? format(new Date(render.created_date), 'MMM d, yyyy • h:mm a') : ''}
          </p>
        </div>
      </Card>
    </Link>
  );
}
