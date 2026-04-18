"use client";

import { useEffect, type ReactNode } from "react";

export default function HydrationFix({ children }: { children: ReactNode }) {
  useEffect(() => {
    // Clean up browser extension injected attributes on body
    const body = document.body;
    const attrsToRemove: string[] = [];
    for (let i = 0; i < body.attributes.length; i++) {
      const name = body.attributes[i].name;
      if (name !== "class" && name !== "style" && name !== "suppresshydrationwarning") {
        attrsToRemove.push(name);
      }
    }
    attrsToRemove.forEach((attr) => body.removeAttribute(attr));
  }, []);

  return <>{children}</>;
}
