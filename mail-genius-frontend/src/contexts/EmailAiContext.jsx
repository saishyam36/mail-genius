import { generateContent } from '@/services/genai-services';
import React, { createContext, useState, useCallback } from 'react';

const EmailAiContext = createContext(null);

export const EmailAiProvider = ({ children }) => {
  const [aiResponse, setAiResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const generateEmailContent = useCallback(async (formData) => {
    setIsLoading(true);
    setError(null);
    setAiResponse(null);

    try {
      const response = await generateContent(formData);
      setAiResponse(response);
    } catch (err) {
      console.error("Error generating email content:", err);
      setError("Failed to generate email content. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const contextValue = React.useMemo(() => ({
    aiResponse,
    isLoading,
    error,
    generateEmailContent,
  }), [aiResponse, isLoading, error, generateEmailContent]);

  return (
    <EmailAiContext.Provider value={contextValue}>
      {children}
    </EmailAiContext.Provider>
  );
};

export { EmailAiContext };
