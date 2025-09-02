import { decodeBase64Url } from '@/utils/helper';
import axios from 'axios';

const GMAIL_API_BASE_URL = 'https://www.googleapis.com/gmail/v1/users/me';

export const listEmails = async (accessToken, query = 'in:inbox', maxResults = 30) => {
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

export const sendReply = async (accessToken, messageId, to, subject, replyText, threadId) => {
  if (!accessToken || !messageId || !to || !subject || !replyText || !threadId) {
    throw new Error('Missing required parameters. All parameters are necessary to send a threaded reply.');
  }

  const emailContent = [
    `Content-Type: text/plain; charset=UTF-8`,
    `To: ${to}`,
    `Subject: RE: ${subject}`,
    // These headers are standard for threading replies
    `In-Reply-To: <${messageId}>`,
    `References: <${messageId}>`,
    '', // Required empty line to separate headers from the body
    replyText
  ].join('\r\n');

  // 3. Encode the message in base64url format as required by the Gmail API
  const raw = btoa(emailContent)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

  // 4. Create the request body. This is the most critical part.
  const requestBody = {
    raw: raw,
    threadId: threadId, // This command ensures the message is added to the correct thread
  };

  try {
    // 5. Send the request using axios
    const response = await axios.post(
      `${GMAIL_API_BASE_URL}/messages/send`,
      requestBody, // The body is the JSON object, not just the raw message
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          // The Content-Type must be application/json because the body is a JSON object
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  } catch (error) {
    // Provide more detailed error logging
    if (error.response) {
      console.error('Error sending reply - API Response:', error.response.data.error.message);
    } else {
      console.error('Error sending reply:', error.message);
    }
    throw error;
  }
};

export const searchEmails = async (accessToken, searchTerm) => {
  const query = `${searchTerm}`;
  return listEmails(accessToken, query);
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
    console.error(`Error fetching email details for ${messageId}:`, error);
   return null;
  }
};

export const getEmailsInThread = async (accessToken, threadId) => {
  if (!accessToken || !threadId) {
    throw new Error('Access token and thread ID are required.');
  }

  try {
    // 1. Fetch the entire thread resource from the Gmail API
    const response = await axios.get(`${GMAIL_API_BASE_URL}/threads/${threadId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      params: {
        format: 'full', // 'full' gets the complete message payload
      },
    });

    const thread = response.data;
    const messages = thread.messages || [];
    const parsedEmails = [];

    // 2. Iterate over each message resource in the thread

    // 2. Iterate over each message resource in the thread
    for (const message of messages) {
      const payload = message.payload;
      const headers = payload.headers || [];

      // 3. Create a structured object to hold the email details
      const emailDetails = {
        id: message.id,
        threadId: message.threadId,
        snippet: message.snippet,
        subject: '',
        from: '',
        to: '',
        date: '',
        body: '',
        messageId: '',
      };

      // 4. Parse the headers to find key information
      for (const header of headers) {
        const name = header.name.toLowerCase();
        if (name === 'subject') emailDetails.subject = header.value;
        if (name === 'from') emailDetails.from = header.value;
        if (name === 'to') emailDetails.to = header.value;
        if (name === 'date') emailDetails.date = header.value;
        if( name === 'message-id') emailDetails.messageId = header.value;
      }

      // 5. Find and decode the message body
      if (payload.parts) {
        // Handle multipart emails (common case)
        for (const part of payload.parts) {
          if (part.mimeType === 'text/plain') {
            emailDetails.body = decodeBase64Url(part.body.data);
            break; // Prefer plain text over HTML
          }
          if (part.mimeType === 'text/html' && !emailDetails.body) {
            emailDetails.body = decodeBase64Url(part.body.data);
          }
        }
      } else if (payload?.body.data) {
        // Handle single-part emails
        emailDetails.body = decodeBase64Url(payload.body.data);
      }

      parsedEmails.push(emailDetails);
    }

    return parsedEmails;
  } catch (error) {
    if (error.response) {
      console.error('Error fetching thread - API Response:', error.response.data.error.message);
    } else {
      console.error('Error fetching thread:', error.message);
    }
    throw error;
  }
};
