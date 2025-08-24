import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import './EmailInbox.css'; // We'll create this CSS file for styling

// In a real app, this data would come from an API
const emails = [
  {
    id: 1,
    sender: 'Bob Johnson',
    subject: 'Weekend Plans',
    content: "Hey everyone! I'm thinking of organizing a team outing this weekend. How about a hike on Saturday followed by a BBQ? Let me know your thoughts!",
    date: '2 days ago',
    isUnread: true
  },
  {
    id: 2,
    sender: 'Sophia White',
    subject: 'Team Dinner',
    content: "To celebrate our recent project success, I'd like to organize a team dinner next Friday. Please vote on the restaurant options in the attached poll. Congratulations again on the great work!",
    date: '1 week ago',
    isUnread: false
  },
  {
    id: 3,
    sender: 'William Smith',
    subject: 'Meeting Tomorrow',
    content: 'Hi team, just a reminder about our meeting tomorrow at 10 AM in the main conference room. The agenda is attached. Please review it beforehand.',
    date: '09:34 AM',
    isUnread: true
  },
  {
    id: 4,
    sender: 'Michael Wilson',
    subject: 'Important Announcement',
    content: 'Please join us for an all-hands meeting this Friday at 3 PM. We will be discussing the quarterly results and future roadmap. Your attendance is mandatory.',
    date: '1 week ago',
    isUnread: false
  },
  {
    id: 5,
    sender: 'Alice Smith',
    subject: 'Re: Project Update',
    content: 'Thanks for the update on the project status. The progress looks great. I have a few minor suggestions which I have added as comments in the document.',
    date: 'Yesterday',
    isUnread: false
  }
];

const EmailInbox = () => {
  const unreadCount = emails.filter(e => e.isUnread).length;

  return (
    <div className="email-inbox-container">
      <div className="inbox-header">
        <h1>Inbox</h1>
        <p>You have {unreadCount} unread messages.</p>
      </div>
      <ul className="email-list">
        {emails.map((email) => (
          <li key={email.id} className={`email-item ${email.isUnread ? 'unread' : ''}`}>
            <Link to={`/email/${email.id}`} className="email-link">
              <div className="sender-details">
                <span className="sender-name">{email.sender}</span>
                <span className="email-date">{email.date}</span>
              </div>
              <div className="email-subject">{email.subject}</div>
              <p className="email-content overflow-hidden">{email.content}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EmailInbox;