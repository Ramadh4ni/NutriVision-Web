import { Camera } from 'lucide-react';
import { resolveImageUrl } from '../../lib/api';

export default function ScanPreview({ scan, onScanAgain }) {
  const photoCount = scan?.photoCount || 1;
  const thumbnails = scan?.thumbnails || (scan?.thumbnail ? [scan.thumbnail] : []);

  if (!scan) {
    return (
      <div
        className="flex flex-col items-center justify-center p-8 sm:p-10 rounded-3xl text-center"
        style={{ backgroundColor: '#F8FAFC' }}
      >
        <div
          className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center mb-4"
          style={{ backgroundColor: '#E2E8F0' }}
        >
          <Camera className="w-6 h-6 sm:w-7 sm:h-7" style={{ color: '#94A3B8' }} />
        </div>
        <p className="text-sm sm:text-base font-medium mb-4" style={{ color: '#64748B' }}>
          No scan available yet
        </p>
        <button
          onClick={onScanAgain}
          className="px-5 py-2.5 rounded-full text-sm font-medium text-white transition-all active:scale-[0.98]"
          style={{
            background: 'linear-gradient(135deg, #4BCA78 0%, #22C55E 100%)',
            boxShadow: '0 4px 14px rgba(74, 222, 120, 0.3)',
          }}
        >
          Start Scanning
        </button>
      </div>
    );
  }

  return (
    <div
      className="flex items-center gap-4 lg:gap-5 p-4 sm:p-5 lg:p-6 rounded-2xl lg:rounded-3xl"
      style={{ backgroundColor: '#F8FAFC' }}
    >
      {/* Thumbnail stack */}
      <div className="flex-shrink-0 relative" style={{ width: 80, height: 80 }}>
        {photoCount === 1 ? (
          <div
            className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-xl lg:rounded-2xl overflow-hidden"
            style={{ width: 64, height: 64 }}
          >
            <img
              src={resolveImageUrl(thumbnails[0])}
              alt="Scanned photo"
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div
            className="relative"
            style={{ width: 64, height: 64 }}
          >
            {/* Back thumbnail (offset) */}
            {thumbnails[1] && (
              <div
                className="absolute rounded-xl overflow-hidden"
                style={{
                  width: 52,
                  height: 52,
                  top: 6,
                  left: 0,
                  border: '2px solid #fff',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
                }}
              >
                <img
                  src={resolveImageUrl(thumbnails[1])}
                  alt=""
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            {/* Front thumbnail (main) */}
            <div
              className="absolute rounded-xl overflow-hidden"
              style={{
                width: 52,
                height: 52,
                top: 0,
                left: 12,
                border: '2px solid #fff',
                boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
                zIndex: 1,
              }}
            >
              <img
                src={resolveImageUrl(thumbnails[0])}
                alt=""
                className="w-full h-full object-cover"
              />
            </div>
            {/* Photo count badge */}
            <div
              className="absolute flex items-center justify-center rounded-full text-white font-bold"
              style={{
                width: 22,
                height: 22,
                fontSize: 10,
                bottom: 0,
                right: 0,
                background: 'linear-gradient(135deg, #22C55E 0%, #16A34A 100%)',
                border: '2px solid #fff',
                boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
                zIndex: 2,
              }}
            >
              {photoCount}
            </div>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm sm:text-base lg:text-lg font-medium" style={{ color: '#1E293B' }}>
          {photoCount} Photo{photoCount !== 1 ? 's' : ''} Processed
        </p>
        <p className="text-xs sm:text-sm mt-0.5" style={{ color: '#16A34A', fontWeight: 600 }}>
          Recommendation Generated
        </p>
        <p className="text-xs sm:text-sm mt-0.5" style={{ color: '#94A3B8' }}>
          {scan.timestamp}
        </p>
      </div>

      {/* Scan Again Button */}
      <button
        onClick={onScanAgain}
        className="px-5 lg:px-6 py-2.5 lg:py-3 rounded-full text-sm lg:text-base font-medium transition-all active:scale-[0.98]"
        style={{
          backgroundColor: '#FFFFFF',
          color: '#16A34A',
          border: '1.5px solid #16A34A',
        }}
      >
        Scan Again
      </button>
    </div>
  );
}