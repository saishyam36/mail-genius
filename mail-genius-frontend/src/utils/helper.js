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

export function getSummaryLengthByWordCount(emailContent) {
  const wordCount = emailContent.trim().split(/\s+/).length;

  if (wordCount <= 100) {
    return 'Very Short';
  } else if (wordCount <= 250) {
    return 'Short';
  } else if (wordCount <= 500) {
    return 'Medium';
  } else if (wordCount <= 1000) {
    return 'Long';
  } else {
    return 'Very Long (7-10 key points)';
  }
}

export function cleanHtmlOutput(htmlString) {
  if (typeof htmlString !== 'string') {
    return '';
  }

  // A more robust and direct approach
  let cleaned = htmlString.trim();

  if (cleaned.startsWith('```html')) {
    cleaned = cleaned.substring(7); // Remove the '```html' part
  }

  if (cleaned.endsWith('```')) {
    cleaned = cleaned.slice(0, -3); // Remove the last '```'
  }

  return cleaned.trim();
}

// Helper function to decode base64url string
export const decodeBase64Url = (input) => {
  return decodeURIComponent(atob(input.replace(/-/g, '+').replace(/_/g, '/')).split('').map(function (c) {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));
};

export const parseEmailContent = (message) => {
  const emailPayload = message.payload;
  let body = '';
  const headers = {};

  emailPayload.headers.forEach(header => {
    headers[header.name] = header.value;
  });

  const getParts = (parts) => {
    parts.forEach(part => {
      if (part.mimeType === 'text/plain' && part.body?.data) {
        body += decodeBase64Url(part.body.data);
      } else if (part.mimeType === 'text/html' && part.body?.data) {
        // Prioritize HTML if available, but for simplicity, we'll just append for now.
        // In a real app, you'd choose one or the other or render HTML safely.
        body += decodeBase64Url(part.body.data);
      } else if (part.parts) {
        getParts(part.parts);
      }
    });
  };

  if (emailPayload.parts) {
    getParts(emailPayload.parts);
  } else if (emailPayload.body?.data) {
    body = decodeBase64Url(emailPayload.body.data);
  }

  return {
    id: message.id,
    messageId: headers['Message-ID'],
    threadId: message.threadId,
    subject: headers['Subject'],
    from: headers['From'],
    to: headers['To'],
    date: headers['Date'],
    body: body,
    headers: headers,
  };
};
