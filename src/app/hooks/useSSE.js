import { useState, useEffect, useRef } from "react";

export default function useSSE(url, onMessageCallback) {
  const [eventSource, setEventSource] = useState(null);
  const retryTimeoutRef = useRef(null);
  const isConnectedRef = useRef(false); // ✅ ป้องกันการเปิดหลาย SSE พร้อมกัน

  useEffect(() => {
    const connectSSE = () => {
      if (isConnectedRef.current) return; // ✅ ป้องกันการเปิดหลายครั้ง
      isConnectedRef.current = true;

      console.log("📡 Connecting to SSE:", url);
      const es = new EventSource(url);

      es.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (typeof onMessageCallback === "function") {
            onMessageCallback(data); // ✅ ตรวจสอบก่อนเรียก Callback
          }
        } catch (error) {
          console.error("❌ Error parsing SSE data:", error);
        }
      };

      es.onerror = (error) => {
        console.error("❌ SSE Error:", error);
        es.close();
        isConnectedRef.current = false; // ✅ ป้องกันการเชื่อมต่อซ้ำ

        // 🔁 ตั้งค่า reconnect หลังจาก 3 วินาที
        retryTimeoutRef.current = setTimeout(connectSSE, 3000);
      };

      setEventSource(es);
    };

    connectSSE();

    return () => {
      if (eventSource) {
        eventSource.close();
        isConnectedRef.current = false;
      }
      clearTimeout(retryTimeoutRef.current);
    };
  }, [url]);

  return eventSource;
}
