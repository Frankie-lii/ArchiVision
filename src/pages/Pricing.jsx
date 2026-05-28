import { useAuth } from '@/lib/AuthContext';
import { toast } from 'sonner';
import PlanCard from '@/components/pricing/PlanCard';
import { Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const PLANS = [
  {
    id: 'free',
    name: 'Free',
    description: 'Perfect for trying out ArchiVision AI',
    price: 'Free',
    period: '',
    cta: 'Current Plan',
    delay: 0,
    features: [
      '5 renders per month',
      '3 design styles',
      'Image staging only',
      'Standard resolution',
      'Community support',
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    description: 'For agents and designers who need more',
    price: 'KSh 10,000',
    period: '/month',
    cta: 'Upgrade to Pro',
    delay: 0.1,
    features: [
      'Unlimited renders',
      'All 7 design styles',
      'Video walkthroughs',
      'HD resolution exports',
      'Architecture rendering',
      'Priority processing',
      'Email support',
    ],
  },
  {
    id: 'agency',
    name: 'Agency',
    description: 'For teams and property developers',
    price: 'KSh 3,000',
    period: '/member/month',
    cta: 'Contact Sales',
    delay: 0.2,
    features: [
      'Everything in Pro',
      'Unlimited team members',
      'White-label exports',
      'Custom branding',
      'API access',
      'Dedicated account manager',
      'SLA guarantee',
    ],
  },
];

export default function Pricing() {
  const { user } = useAuth();
  const currentPlan = user?.plan || 'free';

  const handleSelect = (planId) => {
    if (planId === 'free') return;
    if (planId === 'agency') {
      toast.info('Contact us at sales@archivision.ai for Agency pricing');
      return;
    }
    toast.info('Stripe payments integration coming soon! Contact support to upgrade.');
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }} 
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-2xl mx-auto"
      >
        <div className="flex items-center justify-center gap-2 mb-3">
          <Sparkles className="w-5 h-5 text-accent" />
          <span className="text-xs font-bold tracking-wider uppercase text-accent">Pricing</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-display font-bold">
          Simple, Transparent Pricing
        </h1>
        <p className="text-muted-foreground mt-3 text-sm">
          Start free, upgrade when you're ready. No hidden fees.
        </p>
      </motion.div>

      {/* Plan cards */}
      <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        {PLANS.map(plan => (
          <PlanCard
            key={plan.id}
            plan={plan}
            isPopular={plan.id === 'pro'}
            currentPlan={currentPlan}
            onSelect={handleSelect}
          />
        ))}
      </div>

      {/* FAQ-like section */}
      <div className="text-center text-sm text-muted-foreground max-w-md mx-auto pt-4">
        <p>All plans include access to the AI Studio.</p>
        <p className="mt-1">Need a custom plan? Contact <span className="text-accent font-medium">sales@archivision.ai</span></p>
      </div>
    </div>
  );
}
