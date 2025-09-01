import React, { createContext, useMemo, useState } from 'react';

// eslint-disable-next-line react-refresh/only-export-components
export const EmailInboxContext = createContext();

const EmailInboxProvider = ({ children }) => {
  const [emails, setEmails] = useState([]);
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [summary, setSummary] = useState('');

  const addEmail = useMemo(() => (email) => {
    setEmails((prevEmails) => [...prevEmails, email]);
  }, []);

  const updateEmail = useMemo(() => (updatedEmail) => {
    setEmails((prevEmails) =>
      prevEmails.map((email) =>
        email.id === updatedEmail.id ? updatedEmail : email
      )
    );
  }, []);

  const deleteEmail = useMemo(() => (emailId) => {
    setEmails((prevEmails) => prevEmails.filter((email) => email.id !== emailId));
  }, []);

  const value = useMemo(() => ({
    emails,
    setEmails,
    selectedEmail,
    setSelectedEmail,
    loading,
    setLoading,
    error,
    summary,
    setSummary,
    setError,
    addEmail,
    updateEmail,
    deleteEmail,
  }), [emails, selectedEmail, loading, error,
    addEmail,
    updateEmail,
    deleteEmail,
    summary
  ]);

  return (
    <EmailInboxContext.Provider value={value}>
      {children}
    </EmailInboxContext.Provider>
  );
};

export default EmailInboxProvider;
