export default function TipCard({ icon: Icon, label, description }) {
  return (
    <div
      className="flex flex-col items-start p-5 sm:p-6 rounded-2xl flex-1"
      style={{ backgroundColor: '#F8FAFC' }}
    >
      <div
        className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4"
        style={{ backgroundColor: '#ECFDF5' }}
      >
        <Icon
          className="w-5 h-5"
          style={{ color: '#16A34A' }}
        />
      </div>
      <p className="text-sm font-semibold mb-2" style={{ color: '#1E293B' }}>
        {label}
      </p>
      <p className="text-xs leading-relaxed" style={{ color: '#94A3B8' }}>
        {description}
      </p>
    </div>
  );
}