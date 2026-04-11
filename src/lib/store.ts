import { create } from "zustand";
import { supabase } from "@/lib/supabase";

export interface ConversionHistoryItem {
  id: string;
  fileName: string;
  fromFormat: string;
  toFormat: string;
  fileSize: number;
  convertedSize: number | null;
  timestamp: number;
}

interface ConversionState {
  file: File | null;
  batchFiles: File[];
  isBatchMode: boolean;
  targetFormat: string | null;
  isConverting: boolean;
  progress: number;
  result: {
    success: boolean;
    blob: Blob | null;
    error: string | null;
    convertedSize: number | null;
  } | null;
  history: ConversionHistoryItem[];
  quality: number;
  userId: string | null;

  setFile: (file: File | null) => void;
  setBatchFiles: (files: File[]) => void;
  setIsBatchMode: (mode: boolean) => void;
  setTargetFormat: (format: string | null) => void;
  setIsConverting: (converting: boolean) => void;
  setProgress: (progress: number) => void;
  setResult: (
    result: {
      success: boolean;
      blob: Blob | null;
      error: string | null;
      convertedSize: number | null;
    } | null,
  ) => void;
  setQuality: (quality: number) => void;
  setUserId: (userId: string | null) => void;
  reset: () => void;
  addToHistory: (item: ConversionHistoryItem) => void;
  loadHistory: () => Promise<void>;
  clearHistory: () => void;
}

export const useConversionStore = create<ConversionState>((set, get) => ({
  file: null,
  batchFiles: [],
  isBatchMode: false,
  targetFormat: null,
  isConverting: false,
  progress: 0,
  result: null,
  history: [],
  quality: 0.92,
  userId: null,

  setFile: (file) => set({ file, result: null, targetFormat: null }),
  setBatchFiles: (files) => set({ batchFiles: files, result: null }),
  setIsBatchMode: (mode) => set({ isBatchMode: mode }),
  setTargetFormat: (format) => set({ targetFormat: format }),
  setIsConverting: (converting) => set({ isConverting: converting }),
  setProgress: (progress) => set({ progress }),
  setResult: (result) => set({ result, isConverting: false, progress: 100 }),
  setQuality: (quality) => set({ quality }),
  setUserId: (userId) => set({ userId }),
  reset: () =>
    set({
      file: null,
      batchFiles: [],
      isBatchMode: false,
      targetFormat: null,
      isConverting: false,
      progress: 0,
      result: null,
    }),

  addToHistory: async (item) => {
    const history = [item, ...get().history].slice(0, 20);
    set({ history });
    try {
      localStorage.setItem("fileforge-history", JSON.stringify(history));
    } catch {}

    const userId = get().userId;
    if (userId && supabase) {
      try {
        await supabase.from("conversions").insert({
          user_id: userId,
          file_name: item.fileName,
          from_format: item.fromFormat,
          to_format: item.toFormat,
          file_size: item.fileSize,
          converted_size: item.convertedSize,
        });
      } catch {}
    }
  },

  loadHistory: async () => {
    const userId = get().userId;

    if (userId && supabase) {
      try {
        const { data, error } = await supabase
          .from("conversions")
          .select("*")
          .eq("user_id", userId)
          .order("created_at", { ascending: false })
          .limit(20);

        if (!error && data) {
          const history = data.map(
            (row: {
              id: string;
              file_name: string;
              from_format: string;
              to_format: string;
              file_size: number;
              converted_size: number | null;
              created_at: string;
            }) => ({
              id: row.id,
              fileName: row.file_name,
              fromFormat: row.from_format,
              toFormat: row.to_format,
              fileSize: row.file_size,
              convertedSize: row.converted_size,
              timestamp: new Date(row.created_at).getTime(),
            }),
          );
          set({ history });
          return;
        }
      } catch {}
    }

    try {
      const stored = localStorage.getItem("fileforge-history");
      if (stored) set({ history: JSON.parse(stored) });
    } catch {}
  },

  clearHistory: async () => {
    set({ history: [] });
    try {
      localStorage.removeItem("fileforge-history");
    } catch {}

    const userId = get().userId;
    if (userId && supabase) {
      try {
        await supabase.from("conversions").delete().eq("user_id", userId);
      } catch {}
    }
  },
}));
