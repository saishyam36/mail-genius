import axios from 'axios';

const GMAIL_API_BASE_URL = 'https://www.googleapis.com/gmail/v1/users/me';

export const listEmails = async (accessToken, query = 'in:inbox', maxResults = 10) => {
  if (!accessToken) {
    throw new Error('Access token is required to list emails.');
  }
  try {
    const response = await axios.get(`${GMAIL_API_BASE_URL}/messages`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      params: {
        maxResults: maxResults,
        q: query,
      },
    });
    return response.data.messages || [];
  } catch (error) {
    console.error('Error listing emails:', error.response ? error.response.data : error.message);
    throw error;
  }
};

export const getEmailDetails = async (accessToken, messageId, format = 'full') => {
  if (!accessToken) {
    throw new Error('Access token is required to get email details.');
  }
  if (!messageId) {
    throw new Error('Message ID is required to get email details.');
  }
  try {
    const response = await axios.get(`${GMAIL_API_BASE_URL}/messages/${messageId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      params: {
        format: format,
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching email details for ${messageId}:`, error.response ? error.response.data : error.message);
    throw error;
  }
};

// Helper function to decode base64url string
const decodeBase64Url = (input) => {
  return decodeURIComponent(atob(input.replace(/-/g, '+').replace(/_/g, '/')).split('').map(function(c) {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));
};

export const parseEmailContent = (message) => {
  const emailPayload = message.payload;
  let body = '';
  const headers = {};

  emailPayload.headers.forEach(header => {
     headers[header.name] = header.value;
     console.log(`Header: ${header.name} => ${header.value}`);
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
