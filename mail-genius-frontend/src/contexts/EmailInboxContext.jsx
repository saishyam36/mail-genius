import React, { createContext, useMemo, useState } from 'react';

// eslint-disable-next-line react-refresh/only-export-components
export const EmailInboxContext = createContext();

const emailsData = [
  {
    id: "1",
    name: "William Smith",
    email: "william.smith@example.com",
    subject: "Project Update: Q3 Milestones",
    text: "Hi Team,\n\nPlease find the attached document for the Q3 project milestones. Let's discuss this in our meeting tomorrow.\n\nBest,\nWilliam",
    date: "5 months ago",
    read: true,
  },
  {
    id: "2",
    name: "Olivia Brown",
    email: "olivia.brown@example.com",
    subject: "Re: Marketing Campaign Launch",
    text: "Great work on the new campaign! The initial feedback has been overwhelmingly positive. I've attached the performance report for your review.",
    date: "6 months ago",
    read: false,
  },
  {
    id: "3",
    name: "James Johnson",
    email: "james.johnson@example.com",
    subject: "Your order is on its way!",
    text: "Hello James,\n\nGood news! Your recent order #12345 has been shipped and is expected to arrive by Friday. You can track your package using the link below.\n\nThank you for shopping with us!",
    date: "7 months ago",
    read: true,
  },
  {
    id: "4",
    name: "Sophia Garcia",
    email: "sophia.garcia@example.com",
    subject: "Invitation: Annual Tech Conference 2024",
    text: "Dear Sophia,\n\nWe're excited to invite you to the Annual Tech Conference 2024. Join industry leaders and innovators for three days of insightful talks and networking opportunities. Register now to secure your spot!",
    date: "8 months ago",
    read: false,
  },
  {
    id: "5",
    name: "Liam Martinez",
    email: "liam.martinez@example.com",
    subject: "Meeting Reminder: Client Presentation",
    text: "Hi Liam,\n\nJust a quick reminder about our client presentation scheduled for next Monday at 10 AM. Please ensure all materials are prepared and let me know if you need any assistance.",
    date: "9 months ago",
    read: true,
  },
  {
    id: "6",
    name: "William Smith",
    email: "william.smith@example.com",
    subject: "Project Update: Q3 Milestones",
    text: "Hi Team,\n\nPlease find the attached document for the Q3 project milestones. Let's discuss this in our meeting tomorrow.\n\nBest,\nWilliam",
    date: "5 months ago",
    read: true,
  },
  {
    id: "7",
    name: "Olivia Brown",
    email: "olivia.brown@example.com",
    subject: "Re: Marketing Campaign Launch",
    text: "Great work on the new campaign! The initial feedback has been overwhelmingly positive. I've attached the performance report for your review.",
    date: "6 months ago",
    read: false,
  },
  {
    id: "8",
    name: "James Johnson",
    email: "james.johnson@example.com",
    subject: "Your order is on its way!",
    text: "Hello James,\n\nGood news! Your recent order #12345 has been shipped and is expected to arrive by Friday. You can track your package using the link below.\n\nThank you for shopping with us!",
    date: "7 months ago",
    read: true,
  },
  {
    id: "9",
    name: "Sophia Garcia",
    email: "sophia.garcia@example.com",
    subject: "Invitation: Annual Tech Conference 2024",
    text: "Dear Sophia,\n\nWe're excited to invite you to the Annual Tech Conference 2024. Join industry leaders and innovators for three days of insightful talks and networking opportunities. Register now to secure your spot!",
    date: "8 months ago",
    read: false,
  },
  {
    id: "10",
    name: "Liam Martinez",
    email: "liam.martinez@example.com",
    subject: "Meeting Reminder: Client Presentation",
    text: "Hi Liam,\n\nJust a quick reminder about our client presentation scheduled for next Monday at 10 AM. Please ensure all materials are prepared and let me know if you need any assistance.",
    date: "9 months ago",
    read: true,
  },
];

const EmailInboxProvider = ({ children }) => {
  const [emails, setEmails] = useState(emailsData);
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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
    setError,
    addEmail,
    updateEmail,
    deleteEmail,
  }), [emails, selectedEmail, loading, error,
    addEmail,
    updateEmail,
    deleteEmail,
  ]);

  return (
    <EmailInboxContext.Provider value={value}>
      {children}
    </EmailInboxContext.Provider>
  );
};

export default EmailInboxProvider;