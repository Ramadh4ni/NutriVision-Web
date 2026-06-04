import { createContext, useContext, useMemo, useState } from "react";
import { scanFood as scanFoodRequest } from "../lib/api";

const ScanContext = createContext(null);

const LOCAL_STORAGE_KEY = "nutrivision_last_scan";

export function ScanProvider({ children }) {
  const [lastScan, setLastScan] = useState(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [scanLoading, setScanLoading] = useState(false);

  async function runScan(files) {
    setScanLoading(true);
    try {
      const fileArray = Array.isArray(files) ? files : [files];
      
      const scanPromises = fileArray.map(async (file) => {
        const response = await scanFoodRequest(file);
        return {
          file,
          data: response.data,
        };
      });
      
      const results = await Promise.all(scanPromises);

      if (results.length === 0) throw new Error("No files processed.");

      // Combine all detected items uniquely
      const allDetectedItems = [
        ...new Set(results.flatMap((r) => r.data.detectedItems || [])),
      ];

      // Sum all nutrition macronutrients
      const aggregatedNutrition = results.reduce(
        (total, r) => {
          const nut = r.data.estimatedNutrition || {};
          return {
            calories: total.calories + (Number(nut.calories) || 0),
            protein: total.protein + (Number(nut.protein) || 0),
            carbs: total.carbs + (Number(nut.carbs) || 0),
            fat: total.fat + (Number(nut.fat) || 0),
          };
        },
        { calories: 0, protein: 0, carbs: 0, fat: 0 }
      );

      // Average confidence score
      const avgConfidence =
        results.reduce((sum, r) => sum + (Number(r.data.confidence) || 0), 0) /
        results.length;

      const lastResult = results[results.length - 1].data;

      const consolidatedResult = {
        id: lastResult.id,
        thumbnail: lastResult.imageUrl, // Use persistent server image URL
        thumbnails: results.map((r) => r.data.imageUrl), // Array of server image URLs
        photoCount: fileArray.length, // Number of photos processed
        foodName: allDetectedItems.join(", ") || "Detected Ingredients",
        ingredients: allDetectedItems,
        confidence: avgConfidence,
        nutrition: aggregatedNutrition,
        timestamp: new Date(lastResult.createdAt).toLocaleString(),
        raw: lastResult,
      };

      setLastScan(consolidatedResult);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(consolidatedResult));
      return { success: true, data: consolidatedResult };
    } catch (error) {
      return {
        success: false,
        error: error.payload?.message || error.message,
      };
    } finally {
      setScanLoading(false);
    }
  }

  const value = useMemo(
    () => ({
      lastScan,
      scanLoading,
      saveScan: (scan) => {
        setLastScan(scan);
        if (scan) {
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(scan));
        } else {
          localStorage.removeItem(LOCAL_STORAGE_KEY);
        }
      },
      clearScan: () => {
        setLastScan(null);
        localStorage.removeItem(LOCAL_STORAGE_KEY);
      },
      runScan,
    }),
    [lastScan, scanLoading]
  );

  return <ScanContext.Provider value={value}>{children}</ScanContext.Provider>;
}

export function useScan() {
  const context = useContext(ScanContext);
  if (!context) {
    throw new Error("useScan must be used within ScanProvider");
  }
  return context;
}
