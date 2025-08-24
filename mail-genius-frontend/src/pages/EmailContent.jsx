import React from 'react';
import { useParams, Link } from 'react-router-dom';

// This mock data should ideally be fetched from an API or a shared state
const emails = [
    {
      id: 1,
      sender: 'Bob Johnson',
      subject: 'Weekend Plans',
      content: "Hey everyone! I'm thinking of organizing a team outing this weekend. How about a hike on Saturday followed by a BBQ? Let me know your thoughts!",
      date: '2 days ago',
    },
    {
      id: 2,
      sender: 'Sophia White',
      subject: 'Team Dinner',
      content: "To celebrate our recent project success, I'd like to organize a team dinner next Friday. Please vote on the restaurant options in the attached poll. Congratulations again on the great work!",
      date: '1 week ago',
    },
    {
      id: 3,
      sender: 'William Smith',
      subject: 'Meeting Tomorrow',
      content: 'Hi team, just a reminder about our meeting tomorrow at 10 AM in the main conference room. The agenda is attached. Please review it beforehand.',
      date: '09:34 AM',
    },
    {
      id: 4,
      sender: 'Michael Wilson',
      subject: 'Important Announcement',
      content: 'Please join us for an all-hands meeting this Friday at 3 PM. We will be discussing the quarterly results and future roadmap. Your attendance is mandatory.',
      date: '1 week ago',
    },
    {
      id: 5,
      sender: 'Alice Smith',
      subject: 'Re: Project Update',
      content: 'Thanks for the update on the project status. The progress looks great. I have a few minor suggestions which I have added as comments in the document.',
      date: 'Yesterday',
    }
];

const EmailContent = () => {
  const { id } = useParams();
  const email = emails.find((e) => e.id.toString() === id);

  if (!email) {
    return (
      <div className="p-5">
        <h2 className="text-2xl font-bold">Email not found</h2>
        <Link to="/email/inbox" className="text-blue-500 hover:underline mt-4 inline-block">
          &larr; Back to Inbox
        </Link>
      </div>
    );
  }

  return (
    <div className="p-5 font-sans">
      <Link to="/email/inbox" className="text-blue-500 hover:underline mb-5 inline-block">
        &larr; Back to Inbox
      </Link>
      <div className="border rounded-lg p-5 shadow-sm">
        <h1 className="text-2xl font-bold mt-0 mb-4">{email.subject}</h1>
        <div className="mb-5 text-sm text-muted-foreground">
          <strong>From:</strong> {email.sender}<br />
          <strong>Date:</strong> {email.date}
        </div>
        <div className="whitespace-pre-wrap leading-relaxed">
          {email.content}
        </div>
      </div>
    </div>
  );
};

export default EmailContent;