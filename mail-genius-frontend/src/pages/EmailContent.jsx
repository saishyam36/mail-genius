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
import { generateReply, refineEmailGrammar, summarizeEmail } from '@/services/genai-services';
import { cleanHtmlOutput, getSummaryLengthByWordCount, htmlToPlainText } from '@/utils/helper';
import EmailContentLoader from '@/components/EmailContentLoader';

const EmailContent = () => {
  const { emails, setEmails, selectedEmail,summary,setSummary } = useContext(EmailInboxContext);
  const { accessToken } = useAuth(); // Get accessToken
  const [showReplyEditor, setShowReplyEditor] = useState(false);
  const [emailContentLoading, setEmailContentLoading] = useState(false);
  const [emailContentError, setEmailContentError] = useState(null);
  const [fullEmailDetails, setFullEmailDetails] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSummarizing, setIsSummarizing] = useState(false); // New state for summary loading

  useEffect(() => {
    const fetchFullEmailDetails = async () => {
      if (!selectedEmail || !accessToken) {
        setFullEmailDetails(null);
        return;
      }

      setEmailContentLoading(true);
      setEmailContentError(null);
      try {
        const details = await getEmailDetails(accessToken, selectedEmail.id, 'full');
        const parsedDetails = parseEmailContent(details);
        // console.log("Parsed Email Details:", parsedDetails);
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

  const handleSummarizeClick = async() => {
    if (!selectedEmail || !fullEmailDetails?.body) return;
    if(summary) return; // If summary already exists, do nothing
    setIsSummarizing(true); // Set loading to true
    try {
      const bodyText = htmlToPlainText(fullEmailDetails.body);
      const summaryLength = getSummaryLengthByWordCount(bodyText)
      const aiSummary = await summarizeEmail(bodyText, {length: summaryLength});
      const formattedSummary = cleanHtmlOutput(aiSummary);
      setSummary(formattedSummary);
    } catch (error) {
      console.error("Error summarizing email:", error);
      setSummary("Failed to generate summary."); // Display an error message
    } finally {
      setIsSummarizing(false); // Set loading to false
    }
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
    setIsGenerating(false);
    editor.update(() => {
      const root = $getRoot();
      root.clear();
      const paragraph = $createParagraphNode();
      paragraph.append($createTextNode(content));
      root.append(paragraph);
    });
  };

  const handleMagicReplyClick = async (editor) => {
    if (!selectedEmail || !fullEmailDetails?.from) return;
    setIsGenerating(true);
    const bodyText = htmlToPlainText(fullEmailDetails.body);
    const aiReply = await generateReply(bodyText, { senderName: fullEmailDetails.from, receiverName: fullEmailDetails.to });
    addContentInEditor(editor, aiReply);
  };

  const handleRefineClick = async (editor) => {
    if (!selectedEmail || !fullEmailDetails?.from) return;
    setIsGenerating(true);
    let textInEditor = '';
    editor.getEditorState().read(() => {
      textInEditor = $getRoot().getTextContent();
    });
    if (!textInEditor.trim()) return; // Don't refine empty content
    const aiReply = await refineEmailGrammar(textInEditor, fullEmailDetails.from, fullEmailDetails.to);
    addContentInEditor(editor, aiReply);
  };

  if (!selectedEmail) {
    return (
      <div className="flex flex-1 items-center justify-center">
        No message selected
      </div>
    );
  }

  if (emailContentLoading) {
    return (
      <div className="absolute inset-0 flex items-center justify-center z-10">
        <EmailContentLoader />
      </div>
    );
  }

  if (emailContentError) {
    return (
      <div className="flex flex-1 items-center justify-center h-full text-red-500">{emailContentError}</div>
    );
  }

  if (!fullEmailDetails) {
    return (
      <div className="flex flex-1 items-center justify-centertext-center text-muted-foreground">
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
              className="max-w-lg"
              description="Get a quick summary of this email!!!"
              trigger={<Button size="sm" variant='secondary' onClick={handleSummarizeClick} className="ml-auto rounded hover:bg-primary-foreground">
                <BookOpenText /> <span className="bg-gradient-to-b from-gray-900 via-slate-800 to-neutral-500 bg-clip-text text-transparent">Summarize</span>
            </Button>}
          >
            <SummaryContent summary={summary} isSummarizing={isSummarizing} />
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
              isGenerating={isGenerating}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default EmailContent;
