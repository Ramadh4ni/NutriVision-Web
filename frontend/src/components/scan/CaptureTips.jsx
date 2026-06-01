import { Sun, Target, Layers } from 'lucide-react';
import TipCard from './TipCard';

const tips = [
  {
    icon: Sun,
    label: 'Natural Lighting',
    description: 'Bright, indirect sunlight helps the AI identify textures and ingredient molecular markers.',
  },
  {
    icon: Target,
    label: 'Top-Down Angle',
    description: 'A 90-degree overhead shot allows for the most accurate volume and portion estimation.',
  },
  {
    icon: Layers,
    label: 'Isolate Ingredients',
    description: 'Try to ensure elements like dressings or sauces are visible rather than fully mixed in.',
  },
];

export default function CaptureTips() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
      {tips.map((tip, index) => (
        <TipCard
          key={index}
          icon={tip.icon}
          label={tip.label}
          description={tip.description}
        />
      ))}
    </div>
  );
}