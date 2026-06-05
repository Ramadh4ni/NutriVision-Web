function ProgressBar({ step, totalSteps }) {
  const progress = (step / totalSteps) * 100;

  return (
    <div className="mb-6">
      <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: '#E5E7EB' }}>
        <div
          className="h-full rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progress}%`, backgroundColor: '#11995B' }}
        />
      </div>
    </div>
  );
}

function StepBadge({ step, totalSteps }) {
  return (
    <span className="text-[10px] font-medium px-2.5 py-1 rounded-full" style={{ backgroundColor: '#F0FDF4', color: '#11995B' }}>
      Step {step} of {totalSteps}
    </span>
  );
}

function InfoCardTop() {
  return (
    <div
      className="rounded-[16px] p-5 mb-4"
      style={{ backgroundColor: 'rgba(215, 174, 0, 0.20)', border: '1px solid rgba(215, 174, 0, 0.25)' }}
    >
      <div className="flex items-start gap-3 mb-4">
        <div
          className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: 'rgba(215, 174, 0, 0.30)' }}
        >
          <svg className="w-5 h-5" style={{ color: '#B45309' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wider mb-1" style={{ color: '#92400E' }}>
            Precision matters
          </p>
          <h3 className="text-sm font-bold mb-1" style={{ color: '#111827' }}>
            Why this matters
          </h3>
          <p className="text-xs leading-relaxed" style={{ color: '#78350F' }}>
            Your biometric data helps us calculate your basal metabolic rate and create a personalized nutrition plan.
          </p>
        </div>
      </div>
      <div className="pt-3 border-t" style={{ borderColor: 'rgba(215, 174, 0, 0.25)' }}>
        <div className="flex items-center gap-2">
          <div className="flex -space-x-1.5">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="w-5 h-5 rounded-full border-2 flex items-center justify-center text-[9px] font-medium"
                style={{ backgroundColor: 'rgba(215, 174, 0, 0.20)', borderColor: 'rgba(215, 174, 0, 0.30)', color: '#92400E' }}
              >
                {String.fromCharCode(65 + i)}
              </div>
            ))}
          </div>
          <p className="text-[10px]" style={{ color: '#92400E' }}>
            <span className="font-semibold">+12,847</span> joined this week
          </p>
        </div>
      </div>
    </div>
  );
}

function InfoCardBottom() {
  return (
    <div
      className="rounded-[16px] overflow-hidden relative"
      style={{ backgroundColor: '#FFFFFF', boxShadow: '0 4px 20px rgba(0,0,0,0.04)', border: '1px solid rgba(0,0,0,0.03)' }}
    >
      <img
        src="https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=500&h=200&fit=crop"
        alt="Healthy food"
        className="w-full h-36 object-cover"
      />
      <div
        className="absolute bottom-0 left-0 right-0 p-4"
        style={{
          background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 100%)',
        }}
      >
        <p className="text-[11px] font-medium text-white mb-1.5 leading-snug">
          "NutriVision changed how I track my meals"
        </p>
        <div className="flex items-center gap-1.5">
          <div
            className="w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-medium text-white"
            style={{ backgroundColor: '#11995B' }}
          >
            S
          </div>
          <span className="text-[10px] text-white/70">Sarah M. - 3 months</span>
        </div>
      </div>
    </div>
  );
}

export default function OnboardingLayout({ children, step, totalSteps, heading, subtitle }) {
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#F5F6F4' }}>
      <div className="flex-1 flex items-center max-w-4xl mx-auto w-full px-4 py-8 lg:py-10">
        <div className="grid lg:grid-cols-5 gap-8 lg:gap-10 items-start w-full">
          <div className="lg:col-span-3">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1 pr-4">
                <h1 className="text-xl lg:text-2xl font-bold mb-1.5" style={{ color: '#111827', lineHeight: 1.3 }}>
                  {heading}
                </h1>
                <p className="text-xs lg:text-sm" style={{ color: '#667085', lineHeight: 1.6 }}>
                  {subtitle}
                </p>
              </div>
              <StepBadge step={step} totalSteps={totalSteps} />
            </div>

            <ProgressBar step={step} totalSteps={totalSteps} />

            <div
              className="rounded-[20px] p-6"
              style={{
                backgroundColor: '#FFFFFF',
                boxShadow: '0 2px 16px rgba(0,0,0,0.03)',
                border: '1px solid rgba(15,23,42,0.04)',
              }}
            >
              {children}
            </div>
          </div>

          <div className="lg:col-span-2 hidden lg:block pt-8">
            <InfoCardTop />
            <InfoCardBottom />
          </div>

          <div className="lg:col-span-5 lg:hidden mt-6 space-y-3">
            <InfoCardTop />
            <InfoCardBottom />
          </div>
        </div>
      </div>
    </div>
  );
}