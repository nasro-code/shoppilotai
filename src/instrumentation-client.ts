// This file runs BEFORE React hydration begins.
// It strips browser extension injected attributes (e.g. bis_skin_checked, __processed_*)
// from all DOM elements to prevent hydration mismatch warnings.

try {
  // Remove extension attributes from all existing elements
  const cleanElement = (el: Element) => {
    const attrsToRemove: string[] = [];
    for (let i = 0; i < el.attributes.length; i++) {
      const name = el.attributes[i].name;
      if (
        name.startsWith("bis_") ||
        name.startsWith("__processed") ||
        name === "bis_register"
      ) {
        attrsToRemove.push(name);
      }
    }
    attrsToRemove.forEach((attr) => el.removeAttribute(attr));
  };

  // Clean all elements currently in the DOM
  document.querySelectorAll("*").forEach(cleanElement);

  // Observe future mutations to catch any attributes added after this script runs
  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (
        mutation.type === "attributes" &&
        mutation.target instanceof Element
      ) {
        const name = mutation.attributeName;
        if (
          name &&
          (name.startsWith("bis_") ||
            name.startsWith("__processed") ||
            name === "bis_register")
        ) {
          mutation.target.removeAttribute(name);
        }
      }
    }
  });

  observer.observe(document.documentElement, {
    attributes: true,
    subtree: true,
  });
} catch (e) {
  // Silently ignore errors from instrumentation
}
