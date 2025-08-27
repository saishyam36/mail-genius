import React, { useContext, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Archive,
  Trash2,
  MoreVertical,
  Reply,
  ReplyAll,
  Forward,
} from "lucide-react";
import { EmailInboxContext } from "@/contexts/EmailInboxContext";
import { Separator } from '@radix-ui/react-dropdown-menu';
import RichTextEditor from '@/components/ReplyEditor.jsx';
import { $getRoot } from 'lexical';

const EmailContent = () => {
  const { emails, setEmails, selectedEmail } = useContext(EmailInboxContext);
  const [showReplyEditor, setShowReplyEditor] = useState(false);

  const handleReplyClick = () => {
    setShowReplyEditor(true);
  };

  const handleSendReply = (editorState) => {
    console.log("Sending reply:", editorState);
    const contentJSON = JSON.stringify(editorState);
    console.log('Reply content:', contentJSON);

    // You can also get plain text for notifications or previews
    editorState.read(() => {
      const root = $getRoot(); // Use the imported $getRoot()
      const text = root.getTextContent();
      alert(`Reply Sent!\n\nContent:\n${text.substring(0, 80)}...`);
    });
    setShowReplyEditor(false);
  };

  const handleCancelReply = () => {
    console.log('Reply canceled.');
    setShowReplyEditor(false);
  };

  return (
    <div className="flex-1">
      {selectedEmail ? (
        <div className="flex h-full flex-col">
          <div className="flex items-center p-2">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon">
                <Archive className="h-4 w-4" />
                <span className="sr-only">Archive</span>
              </Button>
              <Button variant="ghost" size="icon">
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Move to trash</span>
              </Button>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={handleReplyClick}>
                <Reply className="h-4 w-4" />
                <span className="sr-only">Reply</span>
              </Button>
              <Button variant="ghost" size="icon">
                <ReplyAll className="h-4 w-4" />
                <span className="sr-only">Reply all</span>
              </Button>
              <Button variant="ghost" size="icon">
                <Forward className="h-4 w-4" />
                <span className="sr-only">Forward</span>
              </Button>
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
                    setEmails(emails.map((e) =>
                      e.id === selectedEmail.id
                        ? { ...e, read: false }
                        : e
                    ));
                  }}
                >
                  Mark as unread
                </DropdownMenuItem>
                <DropdownMenuItem>Star thread</DropdownMenuItem>
                <DropdownMenuItem>Mute thread</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <Separator />
          <div className="flex flex-1 flex-col overflow-y-auto">
            <div className="flex items-start p-4">
              <div className="flex items-start gap-4 text-sm">
                <Avatar>
                  <AvatarImage alt={selectedEmail.name} />
                  <AvatarFallback>
                    {selectedEmail.name
                      .split(" ")
                      .map((chunk) => chunk[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="grid gap-1">
                  <div className="font-semibold">{selectedEmail.name}</div>
                  <div className="line-clamp-1 text-xs">
                    {selectedEmail.subject}
                  </div>
                  <div className="line-clamp-1 text-xs">
                    <span className="font-medium">Reply-To:</span>{" "}
                    {selectedEmail.email}
                  </div>
                </div>
              </div>
              {selectedEmail.date && (
                <div className="ml-auto text-xs text-muted-foreground">
                  {selectedEmail.date}
                </div>
              )}
            </div>
            <Separator />
            <div className="flex-1 whitespace-pre-wrap p-4 text-sm">
              {selectedEmail.text}
            </div>
            {showReplyEditor && (
              <RichTextEditor
                onSend={handleSendReply}
                onCancel={handleCancelReply}
              />
            )}
          </div>
        </div>
      ) : (
        <div className="p-8 text-center text-muted-foreground">
          No message selected
        </div>
      )}
    </div>
  );
};

export default EmailContent;
