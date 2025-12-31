import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function Adsense() {
  const location = useLocation();

  // ❌ Pages where AdSense must NOT load
  const blockedRoutes = ["/login", "/signup", "/admin"];

  useEffect(() => {
    if (blockedRoutes.includes(location.pathname)) return;

    // Avoid duplicate script injection
    if (document.getElementById("adsense-script")) return;

    const script = document.createElement("script");
    script.id = "adsense-script";
    script.async = true;
    script.src =
      "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2424307404737659";
    script.crossOrigin = "anonymous";

    document.head.appendChild(script);
  }, [location.pathname]);

  return null;
}
