import { colors, shadows } from '../../styles/tokens';

export function SectionTitle({ badge, title, subtitle, align = 'left', className = '', badgeStyle, titleStyle, subtitleStyle }) {
  const alignment = align === 'center' ? 'text-center items-center' : 'text-left items-start';

  return (
    <div className={`flex flex-col ${alignment} ${className}`} style={badge ? { gap: '12px' } : { gap: '0px' }}>
      {badge && (
        <span
          className="inline-flex rounded-full tracking-wide uppercase"
          style={{
            backgroundColor: badgeStyle?.backgroundColor || '#EFF6FF',
            color: badgeStyle?.color || '#3B82F6',
            padding: '6px 14px',
            fontSize: badgeStyle?.fontSize || '11px',
            fontWeight: badgeStyle?.fontWeight || '500',
            ...badgeStyle,
          }}
        >
          {badge}
        </span>
      )}
      {title && (
        <h2
          className="font-bold"
          style={{
            color: titleStyle?.color || colors.darkText,
            lineHeight: titleStyle?.lineHeight || 1.2,
            fontSize: titleStyle?.fontSize || '30px',
            ...titleStyle,
          }}
        >
          {title}
        </h2>
      )}
      {subtitle && (
        <p
          className="text-base"
          style={{
            color: subtitleStyle?.color || colors.mutedText,
            lineHeight: subtitleStyle?.lineHeight || 1.6,
            maxWidth: subtitleStyle?.maxWidth || 'none',
            ...subtitleStyle,
          }}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}

export function PrimaryButton({ children, onClick, className = '', style = {} }) {
  return (
    <button
      onClick={onClick}
      className={`px-6 py-3 rounded-full font-semibold text-white transition-all hover:opacity-90 ${className}`}
      style={{
        background: `linear-gradient(to right, ${colors.primaryGreen}, #10B981)`,
        boxShadow: shadows.glow,
        ...style,
      }}
    >
      {children}
    </button>
  );
}

export function SecondaryButton({ children, onClick, className = '' }) {
  return (
    <button
      onClick={onClick}
      className={`px-6 py-3 rounded-full font-semibold transition-all hover:opacity-80 ${className}`}
      style={{
        backgroundColor: 'transparent',
        color: colors.primaryGreen,
        border: `1.5px solid ${colors.primaryGreen}`,
      }}
    >
      {children}
    </button>
  );
}

export function FeatureCard({ title, description, icon, badge, onClick, className = '' }) {
  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-[28px] p-7 cursor-pointer transition-all hover:shadow-md ${className}`}
      style={{ boxShadow: shadows.sm }}
    >
      {badge && (
        <span
          className="inline-flex px-3 py-1 rounded-full text-xs font-bold"
          style={{ backgroundColor: '#DCFCE7', color: colors.primaryGreen }}
        >
          {badge}
        </span>
      )}
      <div className="flex items-start justify-between mt-4">
        <div className="flex-1">
          {title && (
            <h3 className="text-xl font-bold mb-2" style={{ color: colors.darkText }}>
              {title}
            </h3>
          )}
          {description && (
            <p className="text-sm" style={{ color: colors.mutedText, lineHeight: 1.6 }}>
              {description}
            </p>
          )}
        </div>
        {icon && (
          <div className="ml-4">{icon}</div>
        )}
      </div>
    </div>
  );
}

export function StepCard({ number, title, description, className = '' }) {
  return (
    <div
      className={`rounded-[28px] p-7 text-center ${className}`}
      style={{ backgroundColor: '#F0FDF4' }}
    >
      <div
        className="text-5xl font-bold text-emerald-200 mb-4"
        style={{ fontFamily: 'system-ui', fontWeight: 800 }}
      >
        {number}
      </div>
      {title && (
        <h4 className="text-lg font-bold mb-2" style={{ color: colors.darkText }}>
          {title}
        </h4>
      )}
      {description && (
        <p className="text-sm" style={{ color: colors.mutedText, lineHeight: 1.6 }}>
          {description}
        </p>
      )}
    </div>
  );
}

export function FloatingBadge({ children, className = '', style = {} }) {
  return (
    <div
      className={`absolute bg-white rounded-2xl shadow-lg px-4 py-3 ${className}`}
      style={{ boxShadow: shadows.md, ...style }}
    >
      {children}
    </div>
  );
}

export function Card({ children, className = '', style = {} }) {
  return (
    <div
      className={`bg-white rounded-[28px] ${className}`}
      style={{ boxShadow: shadows.sm, ...style }}
    >
      {children}
    </div>
  );
}