/**
 * Purifies input strings by removing dangerous HTML tags, script tags,
 * event handlers, and malicious protocols to prevent XSS attacks.
 */
export const sanitizeInput = (input: string): string => {
  if (!input) return "";
  return (
    input
      // Remove script tags and their inner content
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
      // Remove style tags and their inner content
      .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "")
      // Remove any remaining HTML tags
      .replace(/<[^>]*>/g, "")
      // Remove dangerous URI schemes
      .replace(/(javascript|vbscript|data):/gi, "")
      // Remove inline event handlers (e.g. onclick=, onerror=, onload=)
      .replace(/\bon\w+\s*=/gi, "")
  );
};
