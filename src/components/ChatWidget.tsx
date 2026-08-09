import Script from "next/script";

export default function ChatWidget() {
  return (
    <Script
      src="https://api.wcx.cloud/widget/?id=9940af917b864606bbe22a837fc08179"
      strategy="afterInteractive"
    />
  );
}
