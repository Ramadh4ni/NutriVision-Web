import { Upload, Image, Camera } from 'lucide-react';

export default function UploadDropzone({ onGalleryClick, onCameraClick }) {
  return (
    <div
      className="w-full p-10 sm:p-12 md:p-16 rounded-3xl border-2 border-dashed transition-all hover:border-emerald-400 cursor-pointer"
      style={{
        backgroundColor: '#FFFFFF',
        borderColor: '#E2E8F0',
      }}
      onClick={(e) => {
        if (e.target.closest('button')) return;
        onGalleryClick?.();
      }}
    >
      <div className="flex flex-col items-center text-center">
        <div
          className="w-20 h-20 sm:w-22 sm:h-22 rounded-3xl flex items-center justify-center mb-8 sm:mb-9"
          style={{
            background: 'linear-gradient(135deg, #22C55E 0%, #16A34A 100%)',
            boxShadow: '0 12px 32px rgba(34, 197, 94, 0.25)',
          }}
        >
          <Upload className="w-9 h-9 sm:w-10 sm:h-10 text-white" />
        </div>

        <h2 className="text-3xl sm:text-4xl font-bold mb-4" style={{ color: '#1E293B' }}>
          Upload Your Meal
        </h2>

        <p className="text-base sm:text-lg mb-10 sm:mb-12" style={{ color: '#94A3B8' }}>
          Drag and drop or select from your device
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full sm:max-w-lg sm:justify-center">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onGalleryClick?.();
            }}
            className="w-full sm:w-auto flex items-center justify-center gap-3 py-4 px-10 rounded-full font-semibold text-base transition-all active:scale-[0.98] hover:shadow-lg"
            style={{
              backgroundColor: '#FFFFFF',
              color: '#16A34A',
              border: '2px solid #16A34A',
              boxShadow: '0 4px 14px rgba(22, 163, 74, 0.1)',
            }}
          >
            <Image className="w-5 h-5" />
            Choose Gallery
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onCameraClick?.();
            }}
            className="w-full sm:w-auto flex items-center justify-center gap-3 py-4 px-10 rounded-full font-semibold text-base text-white transition-all active:scale-[0.98] hover:shadow-xl"
            style={{
              background: 'linear-gradient(135deg, #22C55E 0%, #16A34A 100%)',
              boxShadow: '0 8px 24px rgba(22, 163, 74, 0.35)',
            }}
          >
            <Camera className="w-5 h-5" />
            Access Camera
          </button>
        </div>

        <p className="text-sm mt-10 sm:mt-12" style={{ color: '#CBD5E1' }}>
          Supported formats: JPG, PNG, WEBP
        </p>
      </div>
    </div>
  );
}
