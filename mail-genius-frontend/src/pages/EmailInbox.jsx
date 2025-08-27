/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState, useMemo, useContext } from "react";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EmailContent from "./EmailContent";
import { EmailInboxContext } from "@/contexts/EmailInboxContext";

const EmailInbox = () => {
  const { emails, setEmails, setSelectedEmail, selectedEmail } = useContext(EmailInboxContext);

  const [searchTerm, setSearchTerm] = useState("");

  // Effect to handle initial load or invalid ID
  useEffect(() => {
    if (!selectedEmail && emails.length > 0) {
      setSelectedEmail(emails[0]);
    }
  }, [emails, selectedEmail, setSelectedEmail]);

  const handleSelectEmail = (email) => {
    if (!email.read) {
      setEmails(
        emails.map((e) => (e.id === email.id ? { ...e, read: true } : e))
      );
    }
    setSelectedEmail(email);
  };

  const filteredEmails = useMemo(() => {
    if (!searchTerm) return emails;
    return emails.filter(
      (email) =>
        email.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        email.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        email.text.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [emails, searchTerm]);

  return (
    <div className="flex h-full flex-row">
      <div className="w-[300px] shrink-0 border-r">
        <Tabs defaultValue="all" className="flex h-full flex-col ">
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
      </div>
      <EmailContent />
    </div>
  );
};

export default EmailInbox;
