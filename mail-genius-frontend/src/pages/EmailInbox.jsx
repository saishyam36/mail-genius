import { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Archive,
  Search,
  Trash2,
  MoreVertical,
  Reply,
  ReplyAll,
  Forward,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import {
  ResizablePanel,
  ResizablePanelGroup,
  ResizableHandle,
} from "@/components/ui/resizable";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Mock data for emails
const emails = [
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
];

const EmailInbox = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [allEmails, setAllEmails] = useState(emails);
  const [searchTerm, setSearchTerm] = useState("");

  const selectedEmail = useMemo(() => {
    return allEmails.find((email) => email.id === id) || null;
  }, [id, allEmails]);

  // Effect to handle initial load or invalid ID
  useEffect(() => {
    if (!id && allEmails.length > 0) {
      navigate(`/email/inbox/${allEmails[0].id}`, { replace: true });
    }
  }, [id, allEmails, navigate]);

  const handleSelectEmail = (email) => {
    navigate(`/email/inbox/${email.id}`);
    // Mark email as read on selection
    if (!email.read) {
      setAllEmails(
        allEmails.map((e) => (e.id === email.id ? { ...e, read: true } : e))
      );
    }
  };

  const filteredEmails = useMemo(() => {
    if (!searchTerm) return allEmails;
    return allEmails.filter(
      (email) =>
        email.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        email.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        email.text.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [allEmails, searchTerm]);

  return (
      <ResizablePanelGroup
        direction="horizontal"
        onLayout={(sizes) => {
          document.cookie = `react-resizable-panels:layout=${JSON.stringify(
            sizes
          )}`;
        }}
        className="h-full max-h-screen items-stretch"
      >
        <ResizablePanel defaultSize={300} minSize={20} maxSize={20}>
          <Tabs defaultValue="all" className="flex h-full flex-col">
            <div className="flex items-center px-4 py-2">
              <h1 className="text-xl font-bold">Inbox</h1>
              <TabsList className="ml-auto">
                <TabsTrigger
                  value="all"
                  className="text-zinc-600 dark:text-zinc-200"
                >
                  All mail
                </TabsTrigger>
                <TabsTrigger
                  value="unread"
                  className="text-zinc-600 dark:text-zinc-200"
                >
                  Unread
                </TabsTrigger>
              </TabsList>
            </div>
            <Separator />
            <div className="bg-background/95 p-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
              <form>
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search"
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </form>
            </div>
            <TabsContent value="all" className="m-0 flex-1 overflow-y-auto">
              <div className="flex flex-col gap-2 p-4 pt-0">
                {filteredEmails.map((item) => (
                  <button
                    key={item.id}
                    className={cn(
                      "flex flex-col items-start gap-2 rounded-lg border p-3 text-left text-sm transition-all hover:bg-accent",
                      selectedEmail && selectedEmail.id === item.id && "bg-muted"
                    )}
                    onClick={() => handleSelectEmail(item)}
                  >
                    <div className="flex w-full flex-col gap-1">
                      <div className="flex items-center">
                        <div className="flex items-center gap-2">
                          <div className="font-semibold">{item.name}</div>
                          {!item.read && (
                            <span className="flex h-2 w-2 rounded-full bg-blue-600" />
                          )}
                        </div>
                        <div
                          className={cn(
                            "ml-auto text-xs",
                            selectedEmail && selectedEmail.id === item.id
                              ? "text-foreground"
                              : "text-muted-foreground"
                          )}
                        >
                          {item.date}
                        </div>
                      </div>
                      <div className="text-xs font-medium">{item.subject}</div>
                    </div>
                    <div className="line-clamp-2 text-xs text-muted-foreground">
                      {item.text.substring(0, 300)}
                    </div>
                  </button>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="unread" className="m-0 flex-1 overflow-y-auto">
              <div className="flex flex-col gap-2 p-4 pt-0">
                {filteredEmails
                  .filter((item) => !item.read)
                  .map((item) => (
                    <button
                      key={item.id}
                      className={cn(
                        "flex flex-col items-start gap-2 rounded-lg border p-3 text-left text-sm transition-all hover:bg-accent",
                        selectedEmail &&
                        selectedEmail.id === item.id &&
                        "bg-muted"
                      )}
                      onClick={() => handleSelectEmail(item)}
                    >
                      <div className="flex w-full flex-col gap-1">
                        <div className="flex items-center">
                          <div className="flex items-center gap-2">
                            <div className="font-semibold">{item.name}</div>
                            {!item.read && (
                              <span className="flex h-2 w-2 rounded-full bg-blue-600" />
                            )}
                          </div>
                          <div
                            className={cn(
                              "ml-auto text-xs",
                              selectedEmail && selectedEmail.id === item.id
                                ? "text-foreground"
                                : "text-muted-foreground"
                            )}
                          >
                            {item.date}
                          </div>
                        </div>
                        <div className="text-xs font-medium">
                          {item.subject}
                        </div>
                      </div>
                      <div className="line-clamp-2 text-xs text-muted-foreground">
                        {item.text.substring(0, 300)}
                      </div>
                    </button>
                  ))}
              </div>
            </TabsContent>
          </Tabs>
        </ResizablePanel>

        <ResizableHandle withHandle />

        <ResizablePanel defaultSize={600}>
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
                  <Button variant="ghost" size="icon">
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
                        setAllEmails(allEmails.map((e) =>
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
              <div className="flex flex-1 flex-col">
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
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-muted-foreground">
              No message selected
            </div>
          )}
        </ResizablePanel>
      </ResizablePanelGroup>
  );
};

export default EmailInbox;


