import { Check, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';

export default function PlanCard({ plan, isPopular, currentPlan, onSelect }) {
  const isCurrent = currentPlan === plan.id;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: plan.delay || 0 }}
    >
      <Card className={`relative p-6 h-full flex flex-col ${isPopular ? 'border-accent shadow-lg shadow-accent/10' : ''}`}>
        {isPopular && (
          <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent text-accent-foreground gap-1">
            <Star className="w-3 h-3" />
            Most Popular
          </Badge>
        )}

        <div className="mb-6">
          <h3 className="text-lg font-bold">{plan.name}</h3>
          <p className="text-xs text-muted-foreground mt-1">{plan.description}</p>
        </div>

        <div className="mb-6">
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-bold">{plan.price}</span>
            {plan.period && <span className="text-sm text-muted-foreground">{plan.period}</span>}
          </div>
        </div>

        <ul className="space-y-3 mb-8 flex-1">
          {plan.features.map((feature, i) => (
            <li key={i} className="flex items-start gap-2">
              <Check className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
              <span className="text-sm text-muted-foreground">{feature}</span>
            </li>
          ))}
        </ul>

        <Button 
          onClick={() => onSelect(plan.id)}
          variant={isPopular ? 'default' : 'outline'}
          className={`w-full ${isPopular ? 'bg-accent text-accent-foreground hover:bg-accent/90' : ''}`}
          disabled={isCurrent}
        >
          {isCurrent ? 'Current Plan' : plan.cta}
        </Button>
      </Card>
    </motion.div>
  );
}
