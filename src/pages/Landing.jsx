import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, Image, Video, Palette, Building2, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';

const features = [
  {
    icon: Image,
    title: 'AI Room Staging',
    description: 'Upload an empty room photo and get it professionally staged in seconds.',
  },
  {
    icon: Palette,
    title: '7 Design Styles',
    description: 'From Modern to African Contemporary — pick the perfect look for any client.',
  },
  {
    icon: Video,
    title: 'Video Walkthroughs',
    description: 'Generate cinematic property tours from a single staged image.',
  },
  {
    icon: Building2,
    title: 'Architecture Rendering',
    description: 'Turn floor plan sketches into photorealistic 3D visualizations.',
  },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="border-b bg-background/80 backdrop-blur-lg sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-display font-bold">ArchiVision AI</span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login">
              <Button variant="ghost" size="sm">Log In</Button>
            </Link>
            <Link to="/register">
              <Button size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-4 py-20 md:py-32 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 text-accent text-xs font-bold mb-6">
            <Sparkles className="w-3 h-3" />
            AI-Powered Real Estate Staging
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold leading-tight max-w-4xl mx-auto">
            Stage Any Property
            <br />
            <span className="text-accent">In Seconds</span>
          </h1>
          <p className="text-lg text-muted-foreground mt-6 max-w-xl mx-auto">
            Upload a photo of any room. Our AI instantly furnishes, designs, and renders it
            in your chosen style — at a fraction of the cost of traditional staging.
          </p>
          <div className="flex items-center justify-center gap-4 mt-8">
            <Link to="/register">
              <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 gap-2 h-12 px-8 shadow-lg shadow-accent/20">
                Start Free <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="outline" className="h-12 px-8">
                Sign In
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Preview mockup */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.3 }}
          className="mt-16 rounded-2xl border bg-card shadow-2xl shadow-black/5 overflow-hidden max-w-4xl mx-auto"
        >
          <div className="bg-muted/50 px-4 py-3 border-b flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-destructive/60" />
            <div className="w-2.5 h-2.5 rounded-full bg-accent/60" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
            <span className="text-[10px] text-muted-foreground ml-2 font-mono">archivision.ai/studio</span>
          </div>
          <div className="aspect-video bg-gradient-to-br from-primary/5 via-accent/5 to-primary/5 flex items-center justify-center">
            <div className="text-center">
              <div className="w-20 h-20 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-10 h-10 text-accent" />
              </div>
              <p className="text-lg font-display font-bold">AI Studio</p>
              <p className="text-sm text-muted-foreground">Transform spaces with one click</p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-display font-bold">
            Everything You Need
          </h2>
          <p className="text-muted-foreground mt-3">
            Powerful AI tools built for real estate professionals
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="p-6 h-full hover:shadow-lg transition-shadow">
                <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center mb-4">
                  <feature.icon className="w-5 h-5 text-accent" />
                </div>
                <h3 className="font-bold text-lg">{feature.title}</h3>
                <p className="text-sm text-muted-foreground mt-2">{feature.description}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Social proof */}
      <section className="max-w-6xl mx-auto px-4 py-20 text-center">
        <div className="flex items-center justify-center gap-1 mb-4">
          {Array(5).fill(0).map((_, i) => (
            <Star key={i} className="w-5 h-5 fill-accent text-accent" />
          ))}
        </div>
        <blockquote className="text-xl md:text-2xl font-display font-medium max-w-2xl mx-auto">
          "ArchiVision AI saved us 80% on staging costs and reduced our listing time by half."
        </blockquote>
        <p className="text-sm text-muted-foreground mt-4">
          — Sarah M., Real Estate Agent, Nairobi
        </p>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-accent" />
            <span className="font-display font-bold text-sm">ArchiVision AI</span>
          </div>
          <p className="text-xs text-muted-foreground">
            © 2026 ArchiVision AI. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
