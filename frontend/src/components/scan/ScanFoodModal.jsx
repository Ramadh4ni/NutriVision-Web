import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Camera, Plus } from 'lucide-react';
import CaptureTips from './CaptureTips';
import ScanDropzone, { MAX_FILES } from './ScanDropzone';
import CameraModal from './CameraModal';
import { useScan } from '../../context/ScanContext';

function dataUrlToFile(dataUrl) {
  const byteString = atob(dataUrl.split(',')[1]);
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) ia[i] = byteString.charCodeAt(i);
  const blob = new Blob([ab], { type: 'image/png' });
  return new File([blob], `capture-${Date.now()}.png`, { type: 'image/png' });
}

export default function ScanFoodModal({
  isOpen,
  onClose,
}) {
  const [queuedItems, setQueuedItems] = useState([]);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const navigate = useNavigate();
  const { saveScan } = useScan();

  // Camera capture: add to queue without closing modal or navigating
  const handleCapture = useCallback((dataUrl) => {
    const file = dataUrlToFile(dataUrl);
    setQueuedItems((prev) => {
      if (prev.length >= MAX_FILES) return prev;
      return [
        ...prev,
        {
          id: `q-${Date.now()}-${Math.random().toString(36).slice(2)}`,
          previewUrl: dataUrl,
          name: file.name,
          file,
          isCamera: true,
        },
      ];
    });
  }, []);

  // Gallery/drop files from ScanDropzone: add to queue
  const handleFilesQueued = useCallback(
    (files) => {
      if (!files || files.length === 0) return;
      const newItems = files.map((file) => ({
        id: `q-${Date.now()}-${Math.random().toString(36).slice(2)}`,
        previewUrl: URL.createObjectURL(file),
        name: file.name,
        file,
        isCamera: false,
      }));
      setQueuedItems((prev) => {
        const next = [...prev, ...newItems];
        return next.slice(0, MAX_FILES);
      });
    },
    []
  );

  const handleRemoveItem = useCallback((id) => {
    setQueuedItems((prev) => {
      const removed = prev.find((p) => p.id === id);
      if (removed && !removed.isCamera) {
        URL.revokeObjectURL(removed.previewUrl);
      }
      return prev.filter((p) => p.id !== id);
    });
  }, []);

  const handleClearAll = useCallback(() => {
    queuedItems.forEach((item) => {
      if (!item.isCamera) URL.revokeObjectURL(item.previewUrl);
    });
    setQueuedItems([]);
  }, [queuedItems]);

  const handleStartScan = useCallback(() => {
    if (queuedItems.length === 0) return;
    saveScan({
      id: `scan-${Date.now()}`,
      thumbnail: queuedItems[0].previewUrl,
      thumbnails: queuedItems.map((i) => i.previewUrl),
      foodName: queuedItems[0].name,
      photoCount: queuedItems.length,
      ingredients: [],
      timestamp: 'Just now',
    });
    setQueuedItems([]);
    onClose();
    navigate('/recommendation');
  }, [queuedItems, saveScan, onClose, navigate]);

  const handleCameraClick = useCallback(() => {
    setIsCameraOpen(true);
  }, []);

  // Sync camera open/close with modal open/close
  useEffect(() => {
    if (!isOpen) {
      setIsCameraOpen(false);
      // Clear queue when modal closes
      queuedItems.forEach((item) => {
        if (!item.isCamera) URL.revokeObjectURL(item.previewUrl);
      });
      setQueuedItems([]);
    }
  }, [isOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleEscape);
    }
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const hasQueuedItems = queuedItems.length > 0;
  const remainingSlots = MAX_FILES - queuedItems.length;

  return (
    <>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 md:p-8"
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
      >
        <div
          className="relative w-full max-w-xs sm:max-w-2xl md:max-w-3xl lg:max-w-4xl rounded-2xl sm:rounded-3xl p-4 sm:p-8 md:p-10 overflow-y-auto"
          style={{
            backgroundColor: '#FFFFFF',
            boxShadow: '0 25px 50px rgba(0, 0, 0, 0.15)',
            animation: 'modalFadeIn 0.3s ease-out',
            maxHeight: '95vh',
          }}
        >
          <style>{`
            @keyframes modalFadeIn {
              from { opacity: 0; transform: scale(0.96); }
              to { opacity: 1; transform: scale(1); }
            }
          `}</style>

          <button
            onClick={onClose}
            className="absolute top-3 right-3 sm:top-5 sm:right-5 p-1.5 rounded-lg transition-all hover:bg-slate-100 z-10"
            style={{ color: '#94A3B8' }}
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Queued photos section — shown when items are selected */}
          {hasQueuedItems && (
            <div className="mb-5">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-sm font-semibold" style={{ color: '#1E293B' }}>
                    Selected Photos
                  </p>
                  <p className="text-[11px]" style={{ color: '#94A3B8' }}>
                    {queuedItems.length} of {MAX_FILES} photo{queuedItems.length !== 1 ? 's' : ''} selected
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCameraClick}
                    disabled={remainingSlots === 0}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold transition-all hover:opacity-80 disabled:opacity-40"
                    style={{ backgroundColor: '#F0FDF4', color: '#16A34A' }}
                  >
                    <Camera className="w-3.5 h-3.5" />
                    Take Photo
                  </button>
                  <button
                    onClick={handleClearAll}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold transition-all hover:opacity-80"
                    style={{ backgroundColor: '#FEF2F2', color: '#DC2626' }}
                  >
                    Clear All
                  </button>
                </div>
              </div>

              {/* Thumbnail grid */}
              <div
                className="grid gap-3"
                style={{
                  gridTemplateColumns: `repeat(${Math.min(queuedItems.length, 5)}, minmax(72px, 1fr))`,
                }}
              >
                {queuedItems.map((item) => (
                  <div
                    key={item.id}
                    className="relative rounded-xl overflow-hidden group"
                    style={{ aspectRatio: '1', backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0' }}
                  >
                    <img
                      src={item.previewUrl}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      className="absolute top-1 right-1 w-5 h-5 rounded-full flex items-center justify-center transition-all hover:scale-110"
                      style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}
                      title="Remove"
                    >
                      <X className="w-3 h-3 text-white" />
                    </button>
                  </div>
                ))}
                {/* Add slot */}
                {remainingSlots > 0 && (
                  <button
                    onClick={() => document.getElementById('scan-modal-file-input')?.click()}
                    className="rounded-xl flex flex-col items-center justify-center gap-1 transition-all hover:opacity-80"
                    style={{ aspectRatio: '1', backgroundColor: '#F8FAFC', border: '2px dashed #E2E8F0' }}
                  >
                    <Plus className="w-5 h-5" style={{ color: '#94A3B8' }} />
                    <span className="text-[9px]" style={{ color: '#94A3B8' }}>Add</span>
                  </button>
                )}
              </div>

              {/* Start Scan button */}
              <div className="mt-4 pt-4" style={{ borderTop: '1px solid #F1F5F9' }}>
                <button
                  onClick={handleStartScan}
                  disabled={queuedItems.length === 0}
                  className="w-full py-3.5 rounded-full text-sm font-semibold text-white transition-all hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{ background: 'linear-gradient(to right, #005A2C, #006D37)', boxShadow: '0 4px 14px rgba(0, 109, 55, 0.25)' }}
                >
                  Start Scan &rarr;
                </button>
              </div>
            </div>
          )}

          {/* Upload drop zone — only shown when no items queued yet */}
          {!hasQueuedItems && (
            <>
              <ScanDropzone
                onCameraClick={handleCameraClick}
                onFilesQueued={handleFilesQueued}
                onOpenCamera={() => setIsCameraOpen(true)}
              />
            </>
          )}

          {/* Hidden file input triggered by the Add slot above */}
          <input
            id="scan-modal-file-input"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            style={{ display: 'none' }}
            onChange={(e) => {
              const files = e.target.files;
              if (files?.length > 0) handleFilesQueued(Array.from(files));
              e.target.value = '';
            }}
          />

          <div className="pt-4 sm:pt-6 border-t mt-4 sm:mt-6" style={{ borderColor: '#F1F5F9' }}>
            <p className="text-[10px] sm:text-xs font-semibold tracking-wider text-center mb-3 sm:mb-4" style={{ color: '#94A3B8' }}>
              CAPTURE TIPS
            </p>
            <CaptureTips />
          </div>
        </div>
      </div>

      <CameraModal
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        onCapture={() => {}}
        onAddToQueue={handleCapture}
      />
    </>
  );
}