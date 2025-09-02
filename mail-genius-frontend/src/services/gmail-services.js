import axios from 'axios';

const GMAIL_API_BASE_URL = 'https://www.googleapis.com/gmail/v1/users/me';

export const listEmails = async (accessToken, query = 'in:inbox', maxResults = 100) => {
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
    console.error(`Error fetching email details for ${messageId}:`, error.response ? error.response.data : error.message);
    throw error;
  }
};
