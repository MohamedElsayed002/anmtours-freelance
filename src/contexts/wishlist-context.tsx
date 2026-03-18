"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  useEffect,
  type ReactNode,
} from "react";

const WISHLIST_KEY = "amt-tours-wishlist";

type WishlistContextType = {
  wishlist: string[];
  isInWishlist: (serviceId: string) => boolean;
  toggleWishlist: (serviceId: string) => void;
};

const WishlistContext = createContext<WishlistContextType | null>(null);

function loadWishlist(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(WISHLIST_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveWishlist(ids: string[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(WISHLIST_KEY, JSON.stringify(ids));
}

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [wishlist, setWishlist] = useState<string[]>([]);

  useEffect(() => {
    setWishlist(loadWishlist());
  }, []);

  const toggleWishlist = useCallback((serviceId: string) => {
    setWishlist((prev) => {
      const next = prev.includes(serviceId)
        ? prev.filter((id) => id !== serviceId)
        : [...prev, serviceId];
      saveWishlist(next);
      return next;
    });
  }, []);

  const isInWishlist = useCallback(
    (serviceId: string) => wishlist.includes(serviceId),
    [wishlist]
  );

  const value = useMemo(
    () => ({ wishlist, isInWishlist, toggleWishlist }),
    [wishlist, isInWishlist, toggleWishlist]
  );

  return (
    <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within WishlistProvider");
  return ctx;
}
