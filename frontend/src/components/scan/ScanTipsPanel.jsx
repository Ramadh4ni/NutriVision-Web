import { Sun, Target, Layers } from 'lucide-react';

const tips = [
  {
    icon: Sun,
    number: '01',
    label: 'Natural Lighting',
    description: 'Bright, indirect sunlight helps the AI capture the most accurate ingredient data.',
  },
  {
    icon: Target,
    number: '02',
    label: 'Top-Down Angle',
    description: 'A 90-degree overhead shot gives the best volume and portion estimation.',
  },
  {
    icon: Layers,
    number: '03',
    label: 'Isolate Ingredients',
    description: 'Keep sauces and dressings visible on the side rather than fully mixed in.',
  },
];

export default function ScanTipsPanel() {
  return (
    <div
      className="w-full h-full rounded-2xl flex flex-col"
      style={{
        backgroundColor: '#FFFFFF',
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.05)',
      }}
    >
      {/* Panel Title */}
      <div className="px-5 pt-5 pb-4" style={{ borderBottom: '1px solid #F1F5F9' }}>
        <h3 className="text-base font-semibold" style={{ color: '#1E293B' }}>
          Capture Tips
        </h3>
      </div>

      {/* Tips List */}
      <div className="flex flex-col flex-1 px-5 py-3">
        {tips.map((tip, index) => {
          const IconComponent = tip.icon;
          return (
            <div
              key={index}
              className="flex items-start gap-3"
              style={{
                paddingTop: index > 0 ? '12px' : '0',
                paddingBottom: index < tips.length - 1 ? '12px' : '0',
                borderTop: index > 0 ? '1px solid #F8FAFC' : 'none',
              }}
            >
              {/* Numbered Badge */}
              <div
                className="flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center text-sm font-bold"
                style={{
                  backgroundColor: '#ECFDF5',
                  color: '#16A34A',
                }}
              >
                {tip.number}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <IconComponent className="w-4 h-4 flex-shrink-0" style={{ color: '#16A34A' }} />
                  <p
                    className="text-sm font-semibold leading-tight"
                    style={{ color: '#1E293B', lineHeight: 1.55 }}
                  >
                    {tip.label}
                  </p>
                </div>
                <p
                  className="text-xs leading-relaxed"
                  style={{ color: '#64748B', lineHeight: 1.55 }}
                >
                  {tip.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
