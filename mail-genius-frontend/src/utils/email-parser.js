// Normalize whitespace and remove extra blank lines
function normalizeWhitespace(text) {
  return text
    .replace(/\u00a0/g, " ") // non-breaking space -> space
    .replace(/\r\n?|\n/g, "\n") // normalize newlines
    .split("\n")
    .map(line => line.trim())
    .filter((line, idx, arr) => line !== "" || arr[idx - 1] !== "") // remove double blank lines
    .join("\n")
    .trim();
}

// Convert HTML to plain text (remove images, keep links)
export function htmlToPlainText(html) {
  if (!html) return "";

  // Remove script/style/noscript content
  let sanitized = html.replace(/<(script|style|noscript)[\s\S]*?<\/\1>/gi, "");

  // Remove <img> tags
  sanitized = sanitized.replace(/<img[^>]*>/gi, "");

  // Replace <br> and closing block tags with line breaks
  sanitized = sanitized
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(p|div|section|article|li|h[1-6]|tr)>/gi, "\n")
    .replace(/<\/(td|th)>/gi, "\t");

  // Preserve links
  sanitized = sanitized.replace(
    /<a\s+[^>]*href=["']([^"']+)["'][^>]*>(.*?)<\/a>/gi,
    (match, url, text) => {
      const cleanText = text.replace(/<[^>]+>/g, "").trim();
      if (cleanText.toLowerCase() === url.toLowerCase()) {
        return url;
      }
      return cleanText ? `${cleanText} (${url})` : url;
    }
  );

  // Remove all remaining tags
  let text = sanitized.replace(/<[^>]+>/g, "");

  // Decode common HTML entities
  text = text
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'");

  return normalizeWhitespace(text);
}

// // Example usage:
// const html = `
//   <div>
//     Hello <b>world</b>!
//     <img src="image.jpg" alt="test" />
//     <a href="https://example.com">Visit site</a>
//   </div>
// `;

// console.log(htmlToPlainText(html));