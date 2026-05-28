import { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useAuth } from '@/lib/AuthContext';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Wand2, Loader2, Sparkles, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import ImageUploader from '@/components/studio/ImageUploader';
import StyleSelector from '@/components/studio/StyleSelector';
import BeforeAfterSlider from '@/components/studio/BeforeAfterSlider';
import { motion, AnimatePresence } from 'framer-motion';

const ROOM_TYPES = [
  { id: 'living_room', label: 'Living Room' },
  { id: 'bedroom', label: 'Bedroom' },
  { id: 'kitchen', label: 'Kitchen' },
  { id: 'bathroom', label: 'Bathroom' },
  { id: 'office', label: 'Office' },
  { id: 'dining_room', label: 'Dining Room' },
  { id: 'exterior', label: 'Exterior' },
  { id: 'balcony', label: 'Balcony' },
];

const STYLE_PROMPTS = {
  modern: 'modern contemporary interior design with clean lines, neutral palette, elegant furniture, natural light, architectural details',
  minimalist: 'minimalist interior design, white and light tones, simple elegant furniture, zen-like atmosphere, uncluttered space',
  luxury: 'luxury high-end interior design, premium materials, marble, gold accents, crystal chandelier, velvet furnishings, opulent',
  scandinavian: 'Scandinavian interior design, light wood, cozy textiles, plants, hygge style, warm minimalism, natural materials',
  african_contemporary: 'African contemporary interior design, bold patterns, earth tones, handcrafted furniture, natural textures, cultural elements, warm wood',
  industrial: 'industrial interior design, exposed brick, metal fixtures, concrete floors, Edison bulbs, raw materials, urban loft style',
  smart_home: 'modern smart home interior, integrated technology, ambient lighting, sleek surfaces, futuristic design, automated features',
};

export default function Studio() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [style, setStyle] = useState('');
  const [roomType, setRoomType] = useState('');
  const [result, setResult] = useState(null);

  const plan = user?.plan || 'free';
  const rendersUsed = user?.renders_used || 0;
  const rendersLimit = plan === 'free' ? 5 : null;
  const isAtLimit = rendersLimit && rendersUsed >= rendersLimit;

  const handleFileSelect = (selectedFile) => {
    setFile(selectedFile);
    const url = URL.createObjectURL(selectedFile);
    setPreview(url);
    setResult(null);
  };

  const handleClear = () => {
    setFile(null);
    setPreview(null);
    setResult(null);
  };

  const generateMutation = useMutation({
    mutationFn: async () => {
      // Upload the original image
      const { file_url: originalUrl } = await base44.integrations.Core.UploadFile({ file });

      // Build the prompt
      const stylePrompt = STYLE_PROMPTS[style] || style;
      const roomLabel = ROOM_TYPES.find(r => r.id === roomType)?.label || roomType;
      const fullPrompt = `Transform this ${roomLabel.toLowerCase()} into a professionally staged and furnished space with ${stylePrompt}. Photorealistic, high quality, 8K resolution, professional interior photography, natural lighting, magazine quality.`;

      // Generate the AI image
      const { url: generatedUrl } = await base44.integrations.Core.GenerateImage({
        prompt: fullPrompt,
        existing_image_urls: [originalUrl],
      });

      // Save the render
      const render = await base44.entities.Render.create({
        original_image_url: originalUrl,
        generated_image_url: generatedUrl,
        style,
        room_type: roomType,
        render_type: 'staging',
        status: 'completed',
        prompt_used: fullPrompt,
      });

      // Update user render count
      await base44.auth.updateMe({
        renders_used: (rendersUsed || 0) + 1,
      });

      return { originalUrl, generatedUrl, render };
    },
    onSuccess: (data) => {
      setResult(data);
      queryClient.invalidateQueries({ queryKey: ['renders'] });
      toast.success('Render generated successfully!');
    },
    onError: (error) => {
      toast.error('Failed to generate render. Please try again.');
      console.error(error);
    },
  });

  const canGenerate = file && style && roomType && !generateMutation.isPending && !isAtLimit;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-display font-bold flex items-center gap-3">
          <Sparkles className="w-7 h-7 text-accent" />
          AI Studio
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Upload a room photo and watch AI transform it instantly
        </p>
      </div>

      {/* Limit warning */}
      {isAtLimit && (
        <Card className="p-4 border-destructive/50 bg-destructive/5 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium">Render limit reached</p>
            <p className="text-xs text-muted-foreground mt-1">
              You've used all {rendersLimit} renders this month.
            </p>
            <Link to="/pricing">
              <Button size="sm" className="mt-2 bg-accent text-accent-foreground hover:bg-accent/90">
                Upgrade Plan
              </Button>
            </Link>
          </div>
        </Card>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Left: Upload + Config */}
        <div className="space-y-6">
          <Card className="p-5">
            <h2 className="text-sm font-bold mb-3">1. Upload Photo</h2>
            <ImageUploader
              onFileSelect={handleFileSelect}
              preview={preview}
              onClear={handleClear}
              disabled={generateMutation.isPending}
            />
          </Card>

          <Card className="p-5">
            <h2 className="text-sm font-bold mb-3">2. Choose Style</h2>
            <StyleSelector
              selected={style}
              onSelect={setStyle}
              disabled={generateMutation.isPending}
            />
          </Card>

          <Card className="p-5">
            <h2 className="text-sm font-bold mb-3">3. Room Type</h2>
            <Select value={roomType} onValueChange={setRoomType} disabled={generateMutation.isPending}>
              <SelectTrigger>
                <SelectValue placeholder="Select room type" />
              </SelectTrigger>
              <SelectContent>
                {ROOM_TYPES.map(room => (
                  <SelectItem key={room.id} value={room.id}>{room.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Card>

          <Button
            onClick={() => generateMutation.mutate()}
            disabled={!canGenerate}
            className="w-full h-12 bg-accent text-accent-foreground hover:bg-accent/90 text-sm font-bold gap-2 shadow-lg shadow-accent/20"
          >
            {generateMutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Generating... This may take a moment
              </>
            ) : (
              <>
                <Wand2 className="w-4 h-4" />
                Generate Render
              </>
            )}
          </Button>
        </div>

        {/* Right: Result */}
        <div>
          <AnimatePresence mode="wait">
            {generateMutation.isPending ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <Card className="aspect-video flex flex-col items-center justify-center gap-4 p-8">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center">
                      <Sparkles className="w-7 h-7 text-accent animate-pulse" />
                    </div>
                    <div className="absolute inset-0 w-16 h-16 rounded-2xl border-2 border-accent/30 animate-ping" />
                  </div>
                  <div className="text-center">
                    <p className="font-bold text-sm">AI is working its magic</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Transforming your space... usually takes 10-20 seconds
                    </p>
                  </div>
                  <div className="w-48 h-1 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-accent rounded-full"
                      initial={{ width: '0%' }}
                      animate={{ width: '90%' }}
                      transition={{ duration: 15, ease: 'easeOut' }}
                    />
                  </div>
                </Card>
              </motion.div>
            ) : result ? (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="space-y-4">
                  <h2 className="text-sm font-bold">Result</h2>
                  <BeforeAfterSlider
                    beforeUrl={result.originalUrl}
                    afterUrl={result.generatedUrl}
                  />
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <Card className="aspect-video flex flex-col items-center justify-center gap-3 p-8 border-dashed">
                  <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center">
                    <Wand2 className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <div className="text-center">
                    <p className="font-medium text-sm">Your AI render will appear here</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Upload a photo, choose a style, and hit Generate
                    </p>
                  </div>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
