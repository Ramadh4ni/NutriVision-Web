import { useRef, useState, useCallback } from 'react';
import { Upload, Image, Camera, X, FileX } from 'lucide-react';

const VALID_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);
const MAX_SIZE = 5 * 1024 * 1024; // 5 MB
const MAX_FILES = 10;

function buildPreview(file) {
  const valid = VALID_TYPES.has(file.type) && file.size <= MAX_SIZE;
  return {
    id: `preview-${Date.now()}-${Math.random().toString(36).slice(2)}`,
    file,
    previewUrl: URL.createObjectURL(file),
    name: file.name,
    size: file.size,
    valid,
    error: !VALID_TYPES.has(file.type)
      ? 'Unsupported format'
      : file.size > MAX_SIZE
      ? 'Exceeds 5 MB'
      : '',
  };
}

export default function ScanDropzone({
  onGalleryClick,
  onCameraClick,
  onFilesQueued,
  onOpenCamera,
  maxFiles = MAX_FILES,
}) {
  const fileInputRef = useRef(null);
  const dragCounter = useRef(0);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState('');
  const [previews, setPreviews] = useState([]);

  const hasPreviews = previews.length > 0;
  const validCount = previews.filter((p) => p.valid).length;

  // Single shared function: validates files, updates local previews, notifies parent via onFilesQueued.
  const addFiles = useCallback(
    (incoming) => {
      setError('');
      const remaining = maxFiles - previews.length;
      if (remaining <= 0) {
        setError(`Maximum ${maxFiles} files allowed.`);
        return;
      }
      const toProcess = Array.from(incoming).slice(0, remaining);
      const newPreviews = toProcess.map((file) => buildPreview(file));
      const validFiles = newPreviews.filter((p) => p.valid).map((p) => p.file);
      setPreviews((prev) => [...prev, ...newPreviews]);
      onFilesQueued?.(validFiles);
      const totalAfter = previews.length + newPreviews.length;
      if (totalAfter >= maxFiles) {
        setError(`Maximum ${maxFiles} files reached.`);
      } else if (newPreviews.some((p) => !p.valid)) {
        setError(`${newPreviews.filter((p) => !p.valid).length} file(s) rejected — format not supported or too large.`);
      }
    },
    [previews.length, maxFiles, onFilesQueued]
  );

  const handleRemove = useCallback(
    (id) => {
      setPreviews((prev) => {
        const removed = prev.find((p) => p.id === id);
        if (removed) URL.revokeObjectURL(removed.previewUrl);
        const next = prev.filter((p) => p.id !== id);
        onFilesQueued?.(next.filter((p) => p.valid).map((p) => p.file));
        if (next.length < maxFiles) setError('');
        return next;
      });
    },
    [maxFiles, onFilesQueued]
  );

  const handleClearAll = useCallback(() => {
    previews.forEach((p) => URL.revokeObjectURL(p.previewUrl));
    setPreviews([]);
    setError('');
    onFilesQueued?.([]);
  }, [previews, onFilesQueued]);

  const handleGalleryClick = (e) => {
    e?.stopPropagation();
    fileInputRef.current?.click();
    onGalleryClick?.();
  };

  const handleCameraClick = (e) => {
    e?.stopPropagation();
    onOpenCamera?.();
    onCameraClick?.();
  };

  const handleDragOver = (e) => { e.preventDefault(); e.stopPropagation(); };
  const handleDragEnter = (e) => {
    e.preventDefault(); e.stopPropagation();
    dragCounter.current += 1;
    if (dragCounter.current === 1) setIsDragging(true);
  };
  const handleDragLeave = (e) => {
    e.preventDefault(); e.stopPropagation();
    dragCounter.current -= 1;
    if (dragCounter.current === 0) setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current = 0;
    setIsDragging(false);
    const files = e.dataTransfer?.files;
    if (!files || files.length === 0) return;
    addFiles(files);
  };

  const handleInputChange = (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    addFiles(Array.from(files));
    e.target.value = '';
  };

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple
        style={{ display: 'none' }}
        onChange={handleInputChange}
      />

      {/* Empty state dropzone */}
      {!hasPreviews && (
        <div
          className="w-full rounded-xl sm:rounded-2xl border-2 border-dashed transition-all cursor-pointer select-none"
          style={{
            backgroundColor: isDragging ? '#F0FDF4' : '#FAFBFC',
            borderColor: isDragging ? '#16A34A' : '#E2E8F0',
          }}
          onClick={(e) => {
            if (e.target.closest('button')) return;
            fileInputRef.current?.click();
          }}
          onDragOver={handleDragOver}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center text-center px-6 py-8 sm:px-8 sm:py-10">

            <div
              className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-5"
              style={{
                background: 'linear-gradient(135deg, #22C55E 0%, #16A34A 100%)',
                boxShadow: '0 6px 20px rgba(34, 197, 94, 0.25)',
              }}
            >
              <Upload className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>

            <h2 className="text-base sm:text-lg font-bold mb-1.5 sm:mb-2" style={{ color: '#1E293B' }}>
              Upload Your Meal Photos
            </h2>

            <p className="text-[11px] sm:text-xs mb-1.5 sm:mb-2 max-w-xs" style={{ color: '#94A3B8' }}>
              Drag and drop or select from your device
            </p>
            <p className="text-[10px] sm:text-[11px] mb-4 sm:mb-6 max-w-xs" style={{ color: '#CBD5E1' }}>
              Upload up to 10 images for better ingredient detection
            </p>

            <div className="flex flex-col sm:flex-row gap-3 w-full sm:max-w-sm sm:justify-center">
              <button
                onClick={handleGalleryClick}
                className="w-full sm:w-auto min-w-[180px] sm:min-w-[210px] h-12 sm:h-14 px-6 sm:px-8 rounded-full flex items-center justify-center gap-2 font-semibold text-sm transition-all active:scale-[0.98] hover:shadow-md"
                style={{ backgroundColor: '#FFFFFF', color: '#16A34A', border: '2px solid #16A34A' }}
              >
                <Image className="w-4 h-4" />
                Choose Gallery
              </button>
              <button
                onClick={handleCameraClick}
                className="w-full sm:w-auto min-w-[180px] sm:min-w-[210px] h-12 sm:h-14 px-6 sm:px-8 rounded-full flex items-center justify-center gap-2 font-semibold text-sm text-white transition-all active:scale-[0.98]"
                style={{ background: 'linear-gradient(135deg, #22C55E 0%, #16A34A 100%)', boxShadow: '0 8px 20px rgba(34, 197, 94, 0.18)' }}
              >
                <Camera className="w-4 h-4" />
                Access Camera
              </button>
            </div>

            <p className="text-[10px] sm:text-[11px] mt-4 sm:mt-5" style={{ color: '#CBD5E1' }}>
              Supported: JPG, PNG, WEBP &bull; Max 5 MB each &bull; Up to 10 files
            </p>

            {error && (
              <div className="mt-4 flex items-center gap-2 px-4 py-2.5 rounded-xl w-full max-w-sm" style={{ backgroundColor: '#FEF2F2', border: '1px solid #FECACA' }}>
                <FileX className="w-4 h-4 flex-shrink-0" style={{ color: '#DC2626' }} />
                <p className="text-[11px] font-medium text-left" style={{ color: '#DC2626' }}>
                  {error}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Preview section */}
      {hasPreviews && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold" style={{ color: '#1E293B' }}>
                {validCount} of {previews.length} file{previews.length !== 1 ? 's' : ''} selected
              </p>
              <p className="text-[11px]" style={{ color: '#94A3B8' }}>
                {validCount} valid
                {previews.length - validCount > 0 && ` • ${previews.length - validCount} rejected`}
                {previews.length >= maxFiles && ` • Limit reached (${maxFiles})`}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 rounded-full text-xs font-semibold transition-all hover:opacity-80"
                style={{ backgroundColor: '#F0FDF4', color: '#16A34A' }}
              >
                + Add More
              </button>
              <button
                onClick={handleClearAll}
                className="px-4 py-2 rounded-full text-xs font-semibold transition-all hover:opacity-80"
                style={{ backgroundColor: '#FEF2F2', color: '#DC2626' }}
              >
                Clear All
              </button>
            </div>
          </div>

          <div className="grid gap-3" style={{ gridTemplateColumns: `repeat(auto-fill, minmax(100px, 1fr)` }}>
            {previews.map((preview) => (
              <div
                key={preview.id}
                className="relative rounded-xl overflow-hidden group"
                style={{
                  aspectRatio: '1',
                  backgroundColor: '#F8FAFC',
                  border: preview.valid ? '1px solid #E2E8F0' : '1px solid #FECACA',
                }}
              >
                <img
                  src={preview.previewUrl}
                  alt={preview.name}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => handleRemove(preview.id)}
                  className="absolute top-1 right-1 w-5 h-5 rounded-full flex items-center justify-center transition-all hover:scale-110"
                  style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}
                  title="Remove"
                >
                  <X className="w-3 h-3 text-white" />
                </button>
                {!preview.valid && (
                  <div className="absolute inset-0 flex items-center justify-center" style={{ backgroundColor: 'rgba(254,242,242,0.85)' }}>
                    <div className="text-center px-2">
                      <FileX className="w-4 h-4 mx-auto mb-1" style={{ color: '#DC2626' }} />
                      <p className="text-[9px] font-medium leading-tight" style={{ color: '#DC2626' }}>
                        {preview.error}
                      </p>
                    </div>
                  </div>
                )}
                <div className="absolute bottom-0 left-0 right-0 px-1.5 py-1 text-[9px] truncate opacity-0 group-hover:opacity-100 transition-opacity" style={{ backgroundColor: 'rgba(0,0,0,0.5)', color: '#fff' }}>
                  {preview.name}
                </div>
              </div>
            ))}
          </div>

          {error && (
            <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl" style={{ backgroundColor: '#FEF2F2', border: '1px solid #FECACA' }}>
              <FileX className="w-4 h-4 flex-shrink-0" style={{ color: '#DC2626' }} />
              <p className="text-[11px] font-medium" style={{ color: '#DC2626' }}>
                {error}
              </p>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 w-full sm:max-w-sm sm:justify-center">
            <button
              onClick={handleGalleryClick}
              className="w-full sm:w-auto min-w-[180px] sm:min-w-[210px] h-12 sm:h-14 px-6 sm:px-8 rounded-full flex items-center justify-center gap-2 font-semibold text-sm transition-all active:scale-[0.98] hover:shadow-md"
              style={{ backgroundColor: '#FFFFFF', color: '#16A34A', border: '2px solid #16A34A' }}
            >
              <Image className="w-4 h-4" />
              Add More
            </button>
            <button
              onClick={handleCameraClick}
              className="w-full sm:w-auto min-w-[180px] sm:min-w-[210px] h-12 sm:h-14 px-6 sm:px-8 rounded-full flex items-center justify-center gap-2 font-semibold text-sm text-white transition-all active:scale-[0.98]"
              style={{ background: 'linear-gradient(135deg, #22C55E 0%, #16A34A 100%)', boxShadow: '0 8px 20px rgba(34, 197, 94, 0.18)' }}
            >
              <Camera className="w-4 h-4" />
              Take Photo
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export { MAX_FILES };
