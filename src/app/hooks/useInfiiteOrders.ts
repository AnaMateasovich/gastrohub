import { useCallback, useEffect, useRef, useState } from "react";
import { OrderType } from "../types/order.type";

export function useInfiniteOrders(
  initialOrders: OrderType[],
  initialCursor: number | null,
) {
  const [orders, setOrders] = useState(initialOrders);
  const [cursor, setCursor] = useState(initialCursor);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(initialCursor !== null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);

    try {
      const res = await fetch(`/api/orders?cursor=${cursor}`);
      const data = await res.json();
      setOrders((prev) => [...prev, ...data.orders]);
      setCursor(data.nextCursor);
      setHasMore(data.nextCursor !== null);
    } finally {
      setLoading(false);
    }
  }, [cursor, loading, hasMore]);

  const sentinelRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (observerRef.current) observerRef.current.disconnect();
      if (!node) return;

      observerRef.current = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) loadMore();
      });
      observerRef.current.observe(node);
    },
    [loadMore],
  );

  useEffect(() => {
  setOrders(initialOrders);
  setCursor(initialCursor);
}, [initialOrders]); 

  return {orders, loading, hasMore, sentinelRef}
}
