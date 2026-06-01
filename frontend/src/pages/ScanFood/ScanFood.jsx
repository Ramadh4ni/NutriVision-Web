import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lightbulb, PieChart, Cpu, X, Plus, Camera } from "lucide-react";
import DashboardLayout from "../../layouts/DashboardLayout";
import ScanDropzone from "../../components/scan/ScanDropzone";
import CameraModal from "../../components/scan/CameraModal";
import ScanTipsPanel from "../../components/scan/ScanTipsPanel";
import { useScan } from "../../context/ScanContext";

const MAX_FILES = 10;

function dataUrlToFile(dataUrl) {
  const byteString = atob(dataUrl.split(',')[1]);
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) ia[i] = byteString.charCodeAt(i);
  const blob = new Blob([ab], { type: 'image/png' });
  return new File([blob], `capture-${Date.now()}.png`, { type: 'image/png' });
}

const infoCards = [
  {
    icon: Lightbulb,
    badge: "Tip",
    title: "Plain Background",
    description: "Place your meal on a simple, contrasting surface for better recognition.",
    backgroundColor: "#FFFBF0",
    accentColor: "#CA8A04",
  },
  {
    icon: PieChart,
    badge: "Feature",
    title: "Macro Match",
    description: "Our AI estimates portion sizes and calculates macros with 90%+ accuracy.",
    backgroundColor: "#F0F9FF",
    accentColor: "#0284C7",
  },
  {
    icon: Cpu,
    badge: "Engine",
    title: "V3 Vision Engine",
    description: "Powered by NutriAI V3 — our latest model trained on 2M+ food images.",
    backgroundColor: "#FEFCE8",
    accentColor: "#D97706",
  },
];

export default function ScanFood() {
  const navigate = useNavigate();
  const { saveScan } = useScan();

  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [queuedItems, setQueuedItems] = useState([]);

  // Files from gallery/drag-drop: add as queue items
  const handleFilesQueued = (files) => {
    if (!files || files.length === 0) return;
    const newItems = files.map((file) => ({
      id: `q-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      previewUrl: URL.createObjectURL(file),
      name: file.name,
      file,
      isCamera: false,
    }));
    setQueuedItems((prev) => {
      return [...prev, ...newItems].slice(0, MAX_FILES);
    });
  };

  // Camera capture: add as queue item without navigating
  const handleCameraClick = () => {
    setIsCameraOpen(true);
  };

  const handleCapture = (dataUrl) => {
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
  };

  const handleRemoveItem = (id) => {
    setQueuedItems((prev) => {
      const removed = prev.find((p) => p.id === id);
      if (removed && !removed.isCamera) {
        URL.revokeObjectURL(removed.previewUrl);
      }
      return prev.filter((p) => p.id !== id);
    });
  };

  const handleClearAll = () => {
    queuedItems.forEach((item) => {
      if (!item.isCamera) URL.revokeObjectURL(item.previewUrl);
    });
    setQueuedItems([]);
  };

  const handleStartScan = () => {
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
    navigate('/recommendation');
  };

  const hasQueuedItems = queuedItems.length > 0;

  return (
    <DashboardLayout>
      <div
        className="px-4 sm:px-6 lg:px-8"
        style={{ maxWidth: "1380px", margin: "0 auto" }}
      >
        {/* HERO - Title + Subtitle */}
        <div className="mb-4">
          <h1
            className="text-xl sm:text-2xl lg:text-4xl font-bold mb-2"
            style={{ color: "#1E293B" }}
          >
            Scan Food
          </h1>
          <p
            className="text-xs sm:text-sm lg:text-base max-w-lg"
            style={{ color: "#64748B" }}
          >
            Snap a photo of your meal and let our AI break down the nutritional
            content instantly.
          </p>
        </div>

        {/* Upload + Tips Row */}
        <div className="flex flex-col lg:grid lg:grid-cols-[1.8fr_320px] lg:gap-6 items-stretch">
          {/* Upload / Selected Photos Area */}
          <div className="mb-5 lg:mb-0">
            {!hasQueuedItems ? (
              // No photos selected — show upload dropzone
              <ScanDropzone
                onGalleryClick={() => {}}
                onCameraClick={handleCameraClick}
                onFilesQueued={handleFilesQueued}
                onOpenCamera={() => setIsCameraOpen(true)}
              />
            ) : (
              // Photos selected — show queue section + ScanDropzone
              <div className="space-y-4">
                {/* Selected Photos header */}
                <div
                  className="bg-white rounded-2xl p-5 sm:p-6"
                  style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.04)', border: '1px solid #F1F5F9' }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-base font-semibold" style={{ color: '#1E293B' }}>
                        Selected Photos
                      </p>
                      <p className="text-xs mt-0.5" style={{ color: '#94A3B8' }}>
                        {queuedItems.length} of {MAX_FILES} photo{queuedItems.length !== 1 ? 's' : ''} selected
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setIsCameraOpen(true)}
                        disabled={queuedItems.length >= MAX_FILES}
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
                    style={{ gridTemplateColumns: `repeat(${Math.min(queuedItems.length, 5)}, minmax(72px, 1fr))` }}
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
                    {queuedItems.length < MAX_FILES && (
                      <button
                        onClick={() => {
                          document.querySelector('input[type="file"]')?.click();
                        }}
                        className="relative rounded-xl overflow-hidden flex flex-col items-center justify-center gap-1 transition-all hover:opacity-80"
                        style={{ aspectRatio: '1', backgroundColor: '#F8FAFC', border: '2px dashed #E2E8F0' }}
                      >
                        <Plus className="w-5 h-5" style={{ color: '#94A3B8' }} />
                        <span className="text-[9px]" style={{ color: '#94A3B8' }}>Add</span>
                      </button>
                    )}
                  </div>

                  {/* Start Scan button */}
                  <div className="mt-5 pt-4" style={{ borderTop: '1px solid #F1F5F9' }}>
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

                {/* Add more photos via ScanDropzone inline */}
                <ScanDropzone
                  onGalleryClick={() => {}}
                  onCameraClick={handleCameraClick}
                  onFilesQueued={handleFilesQueued}
                  onOpenCamera={() => setIsCameraOpen(true)}
                />
              </div>
            )}
          </div>

          {/* Capture Tips */}
          <div className="lg:col-start-2">
            <ScanTipsPanel />
          </div>
        </div>

        {/* Bottom Cards Row */}
        <div className="flex flex-col sm:grid sm:grid-cols-3 gap-4 mt-5 sm:mt-5">
          {infoCards.map((card, index) => (
            <div
              key={index}
              className="flex flex-row items-start gap-4 p-4 sm:p-5 rounded-2xl transition-all hover:-translate-y-1"
              style={{ backgroundColor: card.backgroundColor, boxShadow: "0 2px 10px rgba(0,0,0,0.04)" }}
            >
              <div
                className="flex-shrink-0 w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center mt-0.5"
                style={{ backgroundColor: `${card.accentColor}18` }}
              >
                <card.icon className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: card.accentColor }} />
              </div>
              <div className="flex-1 min-w-0 space-y-0.5 sm:space-y-1">
                <span
                  className="inline-block text-[10px] sm:text-[11px] font-semibold px-2 py-0.5 rounded-md"
                  style={{ backgroundColor: `${card.accentColor}15`, color: card.accentColor }}
                >
                  {card.badge}
                </span>
                <h4 className="text-xs sm:text-sm font-semibold" style={{ color: "#1E293B" }}>
                  {card.title}
                </h4>
                <p className="text-[11px] sm:text-xs leading-relaxed" style={{ color: "#64748B" }}>
                  {card.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <CameraModal
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        onCapture={() => {}}   // legacy immediate-capture flow — not used in queue mode
        onAddToQueue={(dataUrl) => {
          handleCapture(dataUrl);
          setIsCameraOpen(false);
        }}
      />
    </DashboardLayout>
  );
}