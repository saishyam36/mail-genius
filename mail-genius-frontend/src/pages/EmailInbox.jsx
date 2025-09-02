/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState, useContext } from "react";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EmailContent from "./EmailContent";
import { EmailInboxContext } from "@/contexts/EmailInboxContext";
import { useAuth } from '../auth/AuthProvider'; // Import useAuth
import { listEmails, getEmailDetails, searchEmails,  } from '../services/gmail-services'; // Import Gmail services
import EmailInboxLoader from '@/components/EmailInboxLoader';
import { parseEmailContent } from "@/utils/helper";
import useDebounce from "@/hooks/use-debounce";

const EmailInbox = () => {
  const { emails, setEmails, setSelectedEmail, selectedEmail, setSummary } = useContext(EmailInboxContext);
  const { accessToken, loading: authLoading } = useAuth(); // Get accessToken and authLoading from AuthContext

  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const [inboxLoading, setInboxLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAndSetEmails = async () => {
      if (authLoading || !accessToken) {
        setInboxLoading(false);
        return;
      }
      setError(null);
      try {
        let detailedEmails = [];
        if (debouncedSearchTerm) {
          const messagesResponse = await searchEmails(accessToken, debouncedSearchTerm);
          const messageIds = messagesResponse.map(msg => msg.id);

          const detailedEmailsPromises = messageIds.map(async (messageId) => {
            const details = await getEmailDetails(accessToken, messageId);
            return parseEmailContent(details);
          });

          detailedEmails = await Promise.all(detailedEmailsPromises);
        } else {
          setInboxLoading(true);
          const messagesResponse = await listEmails(accessToken, 'in:inbox');
          const messageIds = messagesResponse.map(msg => msg.id);

          const detailedEmailsPromises = messageIds.map(async (messageId) => {
            const details = await getEmailDetails(accessToken, messageId);
            return parseEmailContent(details);
          });

          detailedEmails = await Promise.all(detailedEmailsPromises);
        }
        setEmails(detailedEmails);
        if (detailedEmails.length > 0 && !selectedEmail) {
          setSelectedEmail(detailedEmails[0]);
        }
      } catch (err) {
        console.error("Failed to fetch emails:", err);
        setError("Failed to load emails. Please try again later.");
      } finally {
        setInboxLoading(false);
      }
    };

    fetchAndSetEmails();
  }, [accessToken, authLoading, debouncedSearchTerm]); // Re-run when accessToken or authLoading changes

  // Effect to handle initial load or invalid ID
  useEffect(() => {
    if (!selectedEmail && emails.length > 0) {
      setSelectedEmail(emails[0]);
    }
  }, [emails, selectedEmail, setSelectedEmail]);

  const handleSelectEmail = (email) => {
    // Mark email as read if it's not already
    if (email.id && !email.read) {
      setEmails(
        emails.map((e) => (e.id === email.id ? { ...e, read: true } : e))
      );
    }
    setSummary('');
    setSelectedEmail(email);
  };

  if (authLoading || inboxLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <EmailInboxLoader />
      </div>
    );
  }

  if (error) {
    return <div className="flex items-center justify-center h-full text-red-500">{error}</div>;
  }

  if (!accessToken) {
    return <div className="flex items-center justify-center h-full text-gray-500">Please log in to view your inbox.</div>;
  }

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
              {emails.map((item) => (
                <button
                  key={item.id}
                  className={cn(
                    "flex flex-col items-start gap-2 rounded-lg border p-3 text-left text-sm transition-all hover:bg-accent",
                    selectedEmail && selectedEmail.id === item.id && "bg-muted"
                  )}
                  onClick={() => handleSelectEmail(item)}
                >
                  <div className="flex w-full flex-col gap-1">
                    <div className="flex items-center space-x-2"> {/* Added space-x-2 for spacing */}
                      <div className="font-semibold truncate flex-1 min-w-0">{item.from}</div> {/* Added truncate and flex-1 min-w-0 */}
                      {/* Gmail API doesn't directly provide a 'read' status in the initial message list,
                          you'd typically check labels for UNREAD. For now, we'll assume all fetched are unread
                          or implement a more complex check if needed. */}
                      {!item.read && (
                        <span className="flex h-2 w-2 rounded-full bg-blue-600" />
                      )}
                      <div
                        className={cn(
                          "text-xs whitespace-nowrap", // Added whitespace-nowrap to prevent date from wrapping
                          selectedEmail && selectedEmail.id === item.id
                            ? "text-foreground"
                            : "text-muted-foreground"
                        )}
                      >
                        {item.date ? new Date(item.date).toLocaleDateString() : 'N/A'}
                      </div>
                    </div>
                    <div className="text-xs font-medium truncate">{item.subject || '(No Subject)'}</div> {/* Added truncate */}
                  </div>
                </button>
              ))}
              {emails.length === 0 && <p className="p-4 text-center text-muted-foreground">No emails found.</p>}
            </div>
          </TabsContent>
          <TabsContent value="unread" className="m-0 flex-1 overflow-y-auto">
            <div className="flex flex-col gap-2 p-4 pt-0">
              {/* For unread, you'd need to filter based on Gmail labels.
                  For simplicity, we'll show all emails here for now. */}
              {emails.map((item) => (
                <button
                  key={item.id}
                  className={cn(
                    "flex flex-col items-start gap-2 rounded-lg border p-3 text-left text-sm transition-all hover:bg-accent",
                    selectedEmail && selectedEmail.id === item.id && "bg-muted"
                  )}
                  onClick={() => handleSelectEmail(item)}
                >
                  <div className="flex w-full flex-col gap-1">
                    <div className="flex items-center space-x-2"> {/* Added space-x-2 for spacing */}
                      <div className="font-semibold truncate flex-1 min-w-0">{item.from}</div> {/* Added truncate and flex-1 min-w-0 */}
                      {/* Gmail API doesn't directly provide a 'read' status in the initial message list,
                          you'd typically check labels for UNREAD. For now, we'll assume all fetched are unread
                          or implement a more complex check if needed. */}
                      {!item.read && (
                        <span className="flex h-2 w-2 rounded-full bg-blue-600" />
                      )}
                      <div
                        className={cn(
                          "text-xs whitespace-nowrap", // Added whitespace-nowrap to prevent date from wrapping
                          selectedEmail && selectedEmail.id === item.id
                            ? "text-foreground"
                            : "text-muted-foreground"
                        )}
                      >
                        {item.date ? new Date(item.date).toLocaleDateString() : 'N/A'}
                      </div>
                    </div>
                    <div className="text-xs font-medium truncate">{item.subject || '(No Subject)'}</div> {/* Added truncate */}
                  </div>
                  <div className="line-clamp-2 text-xs text-muted-foreground">
                    {item.body ? item.body.substring(0, 300) : '(No content)'}
                  </div>
                </button>
              ))}
              {emails.length === 0 && <p className="p-4 text-center text-muted-foreground">No emails found.</p>}
            </div>
          </TabsContent>
        </Tabs>
      </div>
      <EmailContent />
    </div>
  );
};

export default EmailInbox;
