import { motion } from 'framer-motion';

const STYLES = [
  { id: 'modern', label: 'Modern', emoji: '🏙️', color: 'from-blue-500/20 to-blue-600/10' },
  { id: 'minimalist', label: 'Minimalist', emoji: '◻️', color: 'from-gray-400/20 to-gray-500/10' },
  { id: 'luxury', label: 'Luxury', emoji: '✨', color: 'from-amber-500/20 to-amber-600/10' },
  { id: 'scandinavian', label: 'Scandinavian', emoji: '🌿', color: 'from-green-400/20 to-green-500/10' },
  { id: 'african_contemporary', label: 'African Contemporary', emoji: '🌍', color: 'from-orange-500/20 to-orange-600/10' },
  { id: 'industrial', label: 'Industrial', emoji: '⚙️', color: 'from-slate-500/20 to-slate-600/10' },
  { id: 'smart_home', label: 'Smart Home', emoji: '🤖', color: 'from-purple-500/20 to-purple-600/10' },
];

export default function StyleSelector({ selected, onSelect, disabled }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
      {STYLES.map(style => (
        <motion.button
          key={style.id}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => !disabled && onSelect(style.id)}
          disabled={disabled}
          className={`
            relative px-3 py-3 rounded-xl text-left transition-all border-2
            ${selected === style.id 
              ? 'border-accent bg-accent/10 shadow-sm' 
              : 'border-transparent bg-card hover:border-border'}
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          `}
        >
          <span className="text-lg">{style.emoji}</span>
          <p className="text-xs font-semibold mt-1">{style.label}</p>
        </motion.button>
      ))}
    </div>
  );
}

export { STYLES };
