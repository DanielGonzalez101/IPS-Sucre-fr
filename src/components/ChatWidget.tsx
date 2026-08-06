"use client";

import { useEffect } from "react";

export default function ChatWidget() {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://api.wcx.cloud/widget/?id=9940af917b864606bbe22a837fc08179";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      if (document.body.contains(script)) document.body.removeChild(script);
    };
  }, []);

  return null;
}
