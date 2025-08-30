import React, { useContext, useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  // Archive,
  // Trash2,
  MoreVertical,
  Reply,
  // ReplyAll,
  // Forward,
  BookOpenText,
} from "lucide-react";
import { EmailInboxContext } from "@/contexts/EmailInboxContext";
import { Separator } from '@radix-ui/react-dropdown-menu';
import RichTextEditor from '@/components/ReplyEditor';
import { $getRoot, $createParagraphNode, $createTextNode } from 'lexical';
import "@/styles/site-header.scss";
import { ResponsiveModal } from '@/components/ResponsiveModal';
import SummaryContent from '@/components/SummaryContent';
import { useAuth } from '../auth/AuthProvider'; // Import useAuth
import { getEmailDetails, parseEmailContent } from '../services/gmail-services'; // Import Gmail services

const EmailContent = () => {
  const { emails, setEmails, selectedEmail } = useContext(EmailInboxContext);
  const { accessToken } = useAuth(); // Get accessToken
  const [showReplyEditor, setShowReplyEditor] = useState(false);
  const [summary, setSummary] = useState("");
  const [emailContentLoading, setEmailContentLoading] = useState(false);
  const [emailContentError, setEmailContentError] = useState(null);
  const [fullEmailDetails, setFullEmailDetails] = useState(null);

  useEffect(() => {
    const fetchFullEmailDetails = async () => {
      if (!selectedEmail || !accessToken) {
        setFullEmailDetails(null);
        return;
      }

      setEmailContentLoading(true);
      setEmailContentError(null);
      try {
        console.log("Fetching full details for email ID:", selectedEmail.id);
        const details = await getEmailDetails(accessToken, selectedEmail.id, 'full');
        const parsedDetails = parseEmailContent(details);
        setFullEmailDetails(parsedDetails);
      } catch (err) {
        console.error("Failed to fetch full email details:", err);
        setEmailContentError("Failed to load email content.");
        setFullEmailDetails(null);
      } finally {
        setEmailContentLoading(false);
      }
    };

    fetchFullEmailDetails();
  }, [selectedEmail, accessToken]); // Re-fetch when selectedEmail or accessToken changes

  const handleReplyClick = () => {
    setShowReplyEditor(true);
  };

  const handleSummarizeClick = () => {
    if (!selectedEmail || !fullEmailDetails?.body) return;
    //TODO: Integrate with an actual AI summary API
    setSummary(`Summary of: "${fullEmailDetails.subject || 'No Subject'}"\n\n${fullEmailDetails.body.substring(0, 200)}... (This is a simulated summary)`);
  };

  const handleSendReply = (editor) => {
    const editorState = editor.getEditorState();
    const contentJSON = JSON.stringify(editorState);
    console.log('Reply content:', contentJSON);

    // You can also get plain text for notifications or previews
    editorState.read(() => {
      const root = $getRoot();
      const text = root.getTextContent();
      alert(`Reply Sent!\n\nContent:\n${text.substring(0, 80)}...`);
    });

    // After sending, you can clear the editor.
    editor.update(() => {
      $getRoot().clear();
    });

    setShowReplyEditor(false);
  };

  const handleCancelReply = () => {
    console.log('Reply canceled.');
    setShowReplyEditor(false);
  };

  const addContentInEditor = (editor, content) => {
    editor.update(() => {
      const root = $getRoot();
      root.clear();
      const paragraph = $createParagraphNode();
      paragraph.append($createTextNode(content));
      root.append(paragraph);
    });
  };

  const handleMagicReplyClick = (editor) => {
    if (!selectedEmail || !fullEmailDetails?.from) return;
    //TODO: Integrate with an actual AI reply generation API
    const senderNameMatch = fullEmailDetails.from.match(/^([^<]+)/);
    const senderName = senderNameMatch ? senderNameMatch[1].trim() : 'there';
    const aiReply = `AI Reply: Hi ${senderName}, thank you for your email. I will get back to you shortly.`;
    addContentInEditor(editor, aiReply);
  };
  
  const handleRefineClick = (editor) => {
    if (!selectedEmail || !fullEmailDetails?.from) return;
    //TODO: Integrate with an actual AI grammar refinement API
    const senderNameMatch = fullEmailDetails.from.match(/^([^<]+)/);
    const senderName = senderNameMatch ? senderNameMatch[1].trim() : 'there';
    const aiReply = `AI Refined: Hi ${senderName}`; // Placeholder for refinement
    addContentInEditor(editor, aiReply);
  };

  if (!selectedEmail) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        No message selected
      </div>
    );
  }

  if (emailContentLoading) {
    return (
      <div className="flex items-center justify-center h-full">Loading email content...</div>
    );
  }

  if (emailContentError) {
    return (
      <div className="flex items-center justify-center h-full text-red-500">{emailContentError}</div>
    );
  }

  if (!fullEmailDetails) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        Failed to load email details.
      </div>
    );
  }

  const senderName = fullEmailDetails.from ? fullEmailDetails.from.match(/^([^<]+)/)?.[1]?.trim() || fullEmailDetails.from : 'Unknown Sender';
  const senderEmail = fullEmailDetails.from ? fullEmailDetails.from.match(/<([^>]+)>/)?.[1] || fullEmailDetails.from : 'unknown@example.com';
  const initials = senderName.split(" ").map((chunk) => chunk[0]).join("");

  return (
    <div className="flex-1">
      <div className="flex h-full flex-col">
        <div className="flex items-center p-2">
          <div className="flex items-center gap-2">
            {/* <Button variant="ghost" size="icon">
              <Archive className="h-4 w-4" />
              <span className="sr-only">Archive</span>
            </Button>
            <Button variant="ghost" size="icon">
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">Move to trash</span>
            </Button> */}
          </div>
          <div className="ml-auto flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={handleReplyClick}>
              <Reply className="h-4 w-4" />
              <span className="sr-only">Reply</span>
            </Button>
            <ResponsiveModal
              responsive={true}
              title="Summary"
              description="Get a quick summary of this email!!!"
              trigger={<Button size="sm" variant='secondary' onClick={handleSummarizeClick} className="ml-auto rounded hover:bg-primary-foreground">
                <BookOpenText /> <span className="bg-gradient-to-b from-gray-900 via-slate-800 to-neutral-500 bg-clip-text text-transparent">Summarize</span>
              </Button>}
            >
              <SummaryContent summary={summary} />
            </ResponsiveModal>

            {/* <Button variant="ghost" size="icon">
              <ReplyAll className="h-4 w-4" />
              <span className="sr-only">Reply all</span>
            </Button>
            <Button variant="ghost" size="icon">
              <Forward className="h-4 w-4" />
              <span className="sr-only">Forward</span>
            </Button> */}
          </div>
          <Separator orientation="vertical" className="mx-2 h-6" />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-4 w-4" />
                <span className="sr-only">More</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => {
                  if (!selectedEmail) return;
                  // This would ideally call a Gmail API to mark as unread
                  setEmails(emails.map((e) =>
                    e.id === selectedEmail.id
                      ? { ...e, read: false }
                      : e
                  ));
                }}
              >
                Mark as unread
              </DropdownMenuItem>
              {/* <DropdownMenuItem>Star thread</DropdownMenuItem>
              <DropdownMenuItem>Mute thread</DropdownMenuItem> */}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <Separator />
        <div className="flex flex-1 flex-col overflow-y-auto">
          <div className="flex items-start p-4">
            <div className="flex items-start gap-4 text-sm">
              <Avatar>
                <AvatarImage alt={senderName} />
                <AvatarFallback>
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="grid gap-1">
                <div className="font-semibold">{senderName}</div>
                <div className="line-clamp-1 text-xs">
                  {fullEmailDetails.subject || '(No Subject)'}
                </div>
                <div className="line-clamp-1 text-xs">
                  <span className="font-medium">From:</span>{" "}
                  {senderEmail}
                </div>
              </div>
            </div>
            {fullEmailDetails.date && (
              <div className="ml-auto text-xs text-muted-foreground">
                {new Date(fullEmailDetails.date).toLocaleString()}
              </div>
            )}
          </div>
          <Separator />
          <div
            className="flex-1 p-4 text-sm overflow-y-auto max-w-full break-words"
            dangerouslySetInnerHTML={{ __html: fullEmailDetails.body }}
          />
          {showReplyEditor && (
            <RichTextEditor
              onSend={handleSendReply}
              onCancel={handleCancelReply}
              onMagicReply={handleMagicReplyClick}
              onRefineClick={handleRefineClick}
              initialContent={''}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default EmailContent;
