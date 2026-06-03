import { useEffect } from 'react';
import { Clock, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useScan } from '../../context/ScanContext';
import { useAuth } from '../../context/AuthContext';
import { resolveImageUrl } from '../../lib/api';

export default function LastScanResult({ onScanAgain }) {
  const navigate = useNavigate();
  const { lastScan, saveScan } = useScan();
  const { dashboard } = useAuth();

  useEffect(() => {
    if (!lastScan && dashboard?.latestScan) {
      const dbScan = dashboard.latestScan;
      const allDetectedItems = Array.isArray(dbScan.detectedItems) ? dbScan.detectedItems : [];
      const aggregatedNutrition = dbScan.nutritionJson || { calories: 0, protein: 0, carbs: 0, fat: 0 };
      
      saveScan({
        id: dbScan.id,
        thumbnail: resolveImageUrl(dbScan.imageUrl),
        thumbnails: [resolveImageUrl(dbScan.imageUrl)],
        photoCount: 1,
        foodName: allDetectedItems.join(", ") || "Detected Ingredients",
        ingredients: allDetectedItems,
        confidence: dbScan.aiRawOutput?.confidence || 1.0,
        nutrition: aggregatedNutrition,
        timestamp: new Date(dbScan.createdAt).toLocaleString(),
        raw: dbScan,
      });
    }
  }, [lastScan, dashboard?.latestScan, saveScan]);

  if (!lastScan) {
    return (
      <div
        className="flex flex-col items-center justify-center p-6 rounded-2xl text-center"
        style={{ backgroundColor: '#F8FAFC' }}
      >
        <p className="text-sm font-medium mb-3" style={{ color: '#64748B' }}>
          No scan result available
        </p>
        <button
          onClick={() => navigate('/scan-food')}
          className="px-5 py-2.5 rounded-full text-sm font-semibold text-white transition-all active:scale-[0.98]"
          style={{
            background: 'linear-gradient(135deg, #4BCA78 0%, #22C55E 100%)',
            boxShadow: '0 4px 14px rgba(74, 222, 120, 0.3)',
          }}
        >
          Scan Food
        </button>
      </div>
    );
  }

  return (
    <div
      className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 sm:p-5 rounded-2xl"
      style={{ backgroundColor: '#FFFFFF', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}
    >
      <div className="flex items-center gap-3 flex-1 min-w-0">
        {/* Thumbnail */}
        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden flex-shrink-0">
          <img
            src={resolveImageUrl(lastScan.thumbnail)}
            alt={lastScan.foodName}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h3
            className="text-sm sm:text-base font-semibold truncate max-w-[20ch] sm:max-w-[30ch]"
            style={{ color: '#1E293B' }}
            title={lastScan.foodName}
          >
            {lastScan.foodName}
          </h3>
          <p className="text-xs sm:text-sm mt-0.5" style={{ color: '#94A3B8' }}>
            {lastScan.timestamp}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 w-full sm:w-auto">
        <button
          onClick={() => navigate('/recommendation')}
          className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium text-white transition-all active:scale-[0.98]"
          style={{
            background: 'linear-gradient(135deg, #4BCA78 0%, #22C55E 100%)',
            boxShadow: '0 4px 14px rgba(74, 222, 120, 0.3)',
          }}
        >
          <Clock className="w-4 h-4" />
          Open Recommendation
        </button>

        <button
          onClick={onScanAgain}
          className="w-10 h-10 sm:w-10 flex items-center justify-center rounded-full transition-all"
          style={{
            backgroundColor: '#F0FDF4',
            color: '#16A34A',
          }}
          title="Scan again"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
