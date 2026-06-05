import { useEffect, useRef, useState } from 'react';
import { Camera, X } from 'lucide-react';

export default function CameraModal({ isOpen, onClose, onCapture, onAddToQueue }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const [status, setStatus] = useState('idle'); // idle | requesting | active | error
  const [errorMsg, setErrorMsg] = useState('');

  const stopStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  };

  useEffect(() => {
    if (!isOpen) {
      setStatus('idle');
      setErrorMsg('');
      return;
    }

    let cancelled = false;

    const startCamera = async () => {
      setStatus('requesting');
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }

        streamRef.current = stream;
        console.log('[CameraModal] camera stream created');

        // Assign stream to video element and wait for it to be ready before playing
        if (videoRef.current) {
          console.log('[CameraModal] video element found');
          videoRef.current.srcObject = stream;
          console.log('[CameraModal] srcObject assigned');

          videoRef.current.onloadedmetadata = () => {
            if (cancelled) return;
            console.log('[CameraModal] video playback started');
            videoRef.current.play().catch(() => {});
            setStatus('active');
          };
        } else {
          // Video element not yet mounted — assign and play when it mounts
          const attachWhenMounted = setInterval(() => {
            if (!videoRef.current || cancelled) {
              clearInterval(attachWhenMounted);
              return;
            }
            clearInterval(attachWhenMounted);
            console.log('[CameraModal] video element found (late mount)');
            videoRef.current.srcObject = stream;
            console.log('[CameraModal] srcObject assigned');
            videoRef.current.onloadedmetadata = () => {
              if (cancelled) return;
              console.log('[CameraModal] video playback started');
              videoRef.current.play().catch(() => {});
              setStatus('active');
            };
          }, 50);
        }
      } catch (err) {
        if (cancelled) return;
        stopStream();
        setStatus('error');
        setErrorMsg(
          err?.name === 'NotAllowedError'
            ? 'Camera access denied. Please allow camera permission in your browser settings.'
            : err?.name === 'NotFoundError'
            ? 'No camera found. Please connect a webcam and try again.'
            : 'Could not access camera. Please try again.',
        );
      }
    };

    startCamera();

    return () => {
      cancelled = true;
      stopStream();
    };
  }, [isOpen]);

  const handleCapture = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;
    canvas.width = video.videoWidth || video.clientWidth;
    canvas.height = video.videoHeight || video.clientHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0);
    const dataUrl = canvas.toDataURL('image/png');

    // If the parent wants to accumulate captures before scanning, use onAddToQueue.
    // Otherwise fall back to the immediate single-capture flow (no regression).
    if (onAddToQueue) {
      onAddToQueue(dataUrl);
      onClose();
    } else {
      stopStream();
      onCapture(dataUrl);
      onClose();
    }
  };

  const handleClose = () => {
    stopStream();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', backdropFilter: 'blur(4px)' }}
    >
      <style>{`
        @keyframes modalSlideIn {
          from { opacity: 0; transform: translateY(8px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .camera-modal { animation: modalSlideIn 0.25s ease-out; }
      `}</style>

      <div
        className="camera-modal w-full max-w-sm rounded-2xl overflow-hidden"
        style={{
          backgroundColor: '#FFFFFF',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)',
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-5 py-4"
          style={{ borderBottom: '1px solid #F1F5F9' }}
        >
          <div className="flex items-center gap-2.5">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #22C55E 0%, #16A34A 100%)' }}
            >
              <Camera className="w-3.5 h-3.5 text-white" />
            </div>
            <h2 className="text-sm font-semibold" style={{ color: '#1E293B' }}>
              Capture Your Meal
            </h2>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 rounded-lg transition-all hover:bg-slate-100"
            style={{ color: '#94A3B8' }}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Preview area */}
        <div
          className="relative mx-5 my-5 rounded-xl overflow-hidden"
          style={{ backgroundColor: '#F8FAFC', aspectRatio: '4/3' }}
        >
          {/* Live feed */}
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            className="w-full h-full object-cover"
            style={{ display: status === 'active' ? 'block' : 'none' }}
          />

          {/* Requesting permission */}
          {status === 'requesting' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, rgba(34,197,94,0.12) 0%, rgba(22,163,74,0.12) 100%)' }}
              >
                <Camera className="w-5 h-5" style={{ color: '#16A34A' }} />
              </div>
              <p className="text-xs font-medium" style={{ color: '#64748B' }}>
                Requesting camera access...
              </p>
            </div>
          )}

          {/* Error */}
          {status === 'error' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-6 text-center">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: '#FEF2F2' }}
              >
                <Camera className="w-5 h-5" style={{ color: '#EF4444' }} />
              </div>
              <p className="text-xs leading-relaxed" style={{ color: '#64748B' }}>
                {errorMsg}
              </p>
            </div>
          )}
        </div>

        {/* Hidden canvas for frame capture */}
        <canvas ref={canvasRef} style={{ display: 'none' }} />

        {/* Footer */}
        <div
          className="flex items-center justify-end gap-3 px-5 py-4"
          style={{ borderTop: '1px solid #F1F5F9' }}
        >
          <button
            onClick={handleClose}
            className="h-10 px-5 rounded-full text-sm font-semibold transition-all hover:opacity-80"
            style={{ backgroundColor: '#F8FAFC', color: '#64748B', border: '1.5px solid #E2E8F0' }}
          >
            Cancel
          </button>
          <button
            onClick={handleCapture}
            disabled={status !== 'active'}
            className="h-10 px-6 rounded-full text-sm font-semibold text-white transition-all hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
            style={{
              background: 'linear-gradient(to right, #005A2C, #006D37)',
              boxShadow: '0 4px 14px rgba(0, 109, 55, 0.25)',
            }}
          >
            Capture Photo
          </button>
        </div>
      </div>
    </div>
  );
}