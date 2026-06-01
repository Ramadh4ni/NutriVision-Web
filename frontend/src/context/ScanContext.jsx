import { createContext, useContext, useState } from "react";

const ScanContext = createContext(null);

const STORAGE_KEY = "nutrivision_last_scan";

function safeParse(value, fallback) {
  if (value === null || value === undefined) return fallback;
  try {
    return JSON.parse(value);
  } catch {
    console.warn("[ScanContext] Corrupted localStorage data — resetting to default.");
    return fallback;
  }
}

function loadLastScan() {
  const raw = localStorage.getItem(STORAGE_KEY);
  return safeParse(raw, null);
}

export function ScanProvider({ children }) {
  const [lastScan, setLastScan] = useState(() => loadLastScan());

  const saveScan = (scan) => {
    setLastScan(scan);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(scan));
    } catch {}
  };

  const clearScan = () => {
    setLastScan(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
  };

  return (
    <ScanContext.Provider value={{ lastScan, saveScan, clearScan }}>
      {children}
    </ScanContext.Provider>
  );
}

export function useScan() {
  const context = useContext(ScanContext);
  if (!context) {
    throw new Error("useScan must be used within ScanProvider");
  }
  return context;
}