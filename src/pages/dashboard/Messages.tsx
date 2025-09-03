@@ .. @@
 import React, { useState, useEffect } from 'react';
 import { useTranslation } from 'react-i18next';
 import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
 import { Button } from '@/components/ui/button';
 import { Input } from '@/components/ui/input';
 import { Badge } from '@/components/ui/badge';
-import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
+import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
+import { Label } from '@/components/ui/label';
+import { ScrollArea } from '@/components/ui/scroll-area';
 import { 
   MessageSquare, 
   Send, 
   User,
-  Clock,
   Plus,
-  Search
+  Users
 } from 'lucide-react';
 import { useAuth } from '@/contexts/AuthContext';
 import { useToast } from '@/hooks/use-toast';
 import api from '@/lib/api';

@@ .. @@
 interface AvailableUser {
   id: number;
   name: string;
   role: string;
 }

 const Messages: React.FC = () => {
   const { t } = useTranslation();
   const { user } = useAuth();
   const { toast } = useToast();
   const [conversations, setConversations] = useState<Conversation[]>([]);
   const [messages, setMessages] = useState<Message[]>([]);
   const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
   const [newMessage, setNewMessage] = useState('');
   const [loading, setLoading] = useState(true);
   const [sending, setSending] = useState(false);
-  const [availableUsers, setAvailableUsers] = useState<AvailableUser[]>([]);
-  const [showNewConversation, setShowNewConversation] = useState(false);
-  const [selectedNewUser, setSelectedNewUser] = useState<string>('');
+  const [isNewConversationOpen, setIsNewConversationOpen] = useState(false);

   useEffect(() => {
     fetchInbox();
-    fetchAvailableUsers();
   }, []);

   useEffect(() => {
     if (selectedUserId) {
       fetchConversation(selectedUserId);
     }
   }, [selectedUserId]);

   const fetchInbox = async () => {
     try {
       const response = await api.get('/messages/inbox');
       setConversations(response.data || []);
     } catch (error) {
       console.error('Failed to fetch inbox:', error);
     } finally {
       setLoading(false);
     }
   };

-  const fetchAvailableUsers = async () => {
-    try {
-      // Fetch users with opposite role (customers see suppliers, suppliers see customers)
-      const response = await api.get('/users?role=' + (user?.role === 'customer' ? 'supplier' : 'customer'));
-      setAvailableUsers(response.data || []);
-    } catch (error) {
-      console.error('Failed to fetch users:', error);
-    }
-  };

   const fetchConversation = async (userId: number) => {
     try {
       const response = await api.get(`/messages/${userId}`);
       setMessages(response.data || []);
     } catch (error) {
       console.error('Failed to fetch conversation:', error);
       toast({
         title: "Error",
         description: "Failed to load conversation. Please try again.",
         variant: "destructive",
       });
     }
   };

   const sendMessage = async (e: React.FormEvent) => {
     e.preventDefault();
     if (!newMessage.trim() || !selectedUserId) return;

     setSending(true);
     try {
       const response = await api.post('/messages', {
         receiver_id: selectedUserId,
         content: newMessage
       });
       
-      // Add the new message to the current conversation
       setMessages(prev => [...prev, response.data]);
       setNewMessage('');
       
-      // Refresh inbox to update latest message
       fetchInbox();
     } catch (error: any) {
       console.error('Failed to send message:', error);
       toast({
         title: "Error",
         description: error.response?.data?.message || "Failed to send message. Please try again.",
         variant: "destructive",
       });
     } finally {
       setSending(false);
     }
   };

-  const startNewConversation = () => {
-    if (!selectedNewUser) return;
-    const userId = parseInt(selectedNewUser);
-    setSelectedUserId(userId);
-    setShowNewConversation(false);
-    setSelectedNewUser('');
-    // Add to conversations if not already there
-    const existingConversation = conversations.find(c => c.user_id === userId);
-    if (!existingConversation) {
-      const newUser = availableUsers.find(u => u.id === userId);
-      if (newUser) {
-        const newConversation: Conversation = {
-          user_id: userId,
-          user_name: newUser.name,
-          latest_message: {
-            content: 'Start a conversation...',
-            created_at: new Date().toISOString(),
-            is_read: true,
-            sent_by_me: false
-          },
-          unread_count: 0
-        };
-        setConversations(prev => [newConversation, ...prev]);
-      }
-    }
-  };
-
-  const markAsRead = async (messageId: number) => {
-    try {
-      await api.patch(`/messages/${messageId}/read`);
-    } catch (error) {
-      console.error('Failed to mark message as read:', error);
-    }
-  };

   const selectedConversation = conversations.find(c => c.user_id === selectedUserId);

   if (loading) {
     return (
       <div className="space-y-6">
         <h1 className="text-2xl font-bold">Messages</h1>
-        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
-          <Card className="animate-pulse">
-            <CardContent className="p-6">
-              <div className="h-8 bg-muted rounded"></div>
-            </CardContent>
-          </Card>
+        <div className="animate-pulse">
+          <div className="h-96 bg-muted rounded-lg"></div>
         </div>
       </div>
     );
   }

   return (
     <div className="space-y-6">
-      <h1 className="text-2xl font-bold">Messages</h1>
+      <div className="flex justify-between items-center">
+        <h1 className="text-2xl font-bold">Messages</h1>
+        <Dialog open={isNewConversationOpen} onOpenChange={setIsNewConversationOpen}>
+          <DialogTrigger asChild>
+            <Button>
+              <Plus className="h-4 w-4 mr-2" />
+              New Message
+            </Button>
+          </DialogTrigger>
+          <DialogContent>
+            <DialogHeader>
+              <DialogTitle>Start New Conversation</DialogTitle>
+            </DialogHeader>
+            <div className="space-y-4">
+              <div>
+                <Label>Search for users to message</Label>
+                <p className="text-sm text-muted-foreground">
+                  Feature coming soon - you can reply to existing conversations for now
+                </p>
+              </div>
+            </div>
+          </DialogContent>
+        </Dialog>
+      </div>
       
-      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
+      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[700px]">
         {/* Conversations List */}
         <Card className="shadow-card">
           <CardHeader>
-            <CardTitle className="flex items-center justify-between">
-              <div className="flex items-center">
-                <MessageSquare className="h-5 w-5 mr-2" />
-                Conversations
-              </div>
-              <Button 
-                size="sm" 
-                onClick={() => setShowNewConversation(true)}
-                className="h-8 w-8 p-0"
-              >
-                <Plus className="h-4 w-4" />
-              </Button>
+            <CardTitle className="flex items-center">
+              <MessageSquare className="h-5 w-5 mr-2" />
+              Conversations
             </CardTitle>
-            {showNewConversation && (
-              <div className="space-y-2 pt-2">
-                <Select value={selectedNewUser} onValueChange={setSelectedNewUser}>
-                  <SelectTrigger className="w-full">
-                    <SelectValue placeholder="Select user to message" />
-                  </SelectTrigger>
-                  <SelectContent>
-                    {availableUsers
-                      .filter(u => !conversations.some(c => c.user_id === u.id))
-                      .map(user => (
-                        <SelectItem key={user.id} value={user.id.toString()}>
-                          {user.name} ({user.role})
-                        </SelectItem>
-                      ))}
-                  </SelectContent>
-                </Select>
-                <div className="flex space-x-2">
-                  <Button 
-                    size="sm" 
-                    onClick={startNewConversation}
-                    disabled={!selectedNewUser}
-                  >
-                    Start Chat
-                  </Button>
-                  <Button 
-                    size="sm" 
-                    variant="outline"
-                    onClick={() => {
-                      setShowNewConversation(false);
-                      setSelectedNewUser('');
-                    }}
-                  >
-                    Cancel
-                  </Button>
-                </div>
-              </div>
-            )}
           </CardHeader>
           <CardContent className="p-0">
-            <div className="max-h-[500px] overflow-y-auto">
+            <ScrollArea className="h-[500px]">
               {conversations.length === 0 ? (
                 <div className="p-6 text-center text-muted-foreground">
                   <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                   <p>No conversations yet</p>
                 </div>
               ) : (
                 conversations.map((conversation) => (
                   <div
                     key={conversation.user_id}
                     className={`p-4 border-b cursor-pointer hover:bg-muted/50 transition-colors ${
                       selectedUserId === conversation.user_id ? 'bg-muted' : ''
                     }`}
                     onClick={() => setSelectedUserId(conversation.user_id)}
                   >
                     <div className="flex items-start justify-between">
                       <div className="flex-1">
                         <div className="flex items-center space-x-2">
                           <h4 className="font-medium">{conversation.user_name}</h4>
                         </div>
                         <p className="text-sm text-muted-foreground truncate mt-1">
                           {conversation.latest_message.sent_by_me ? 'You: ' : ''}
                           {conversation.latest_message.content}
                         </p>
-                        <div className="flex items-center space-x-2 mt-2">
-                          <Clock className="h-3 w-3 text-muted-foreground" />
-                          <span className="text-xs text-muted-foreground">
+                        <span className="text-xs text-muted-foreground mt-1 block">
                             {new Date(conversation.latest_message.created_at).toLocaleDateString()}
-                          </span>
-                        </div>
+                        </span>
                       </div>
                       {conversation.unread_count > 0 && (
                         <Badge variant="destructive" className="ml-2">
                           {conversation.unread_count}
                         </Badge>
                       )}
                     </div>
                   </div>
                 ))
               )}
-            </div>
+            </ScrollArea>
           </CardContent>
         </Card>

         {/* Messages */}
         <div className="lg:col-span-2">
           <Card className="shadow-card h-full flex flex-col">
             <CardHeader>
               <CardTitle className="flex items-center">
                 <User className="h-5 w-5 mr-2" />
                 {selectedConversation ? selectedConversation.user_name : 'Select a conversation'}
               </CardTitle>
             </CardHeader>
             <CardContent className="flex-1 flex flex-col p-0">
               {!selectedUserId ? (
                 <div className="flex-1 flex items-center justify-center text-muted-foreground">
                   <div className="text-center">
                     <MessageSquare className="h-16 w-16 mx-auto mb-4 opacity-50" />
                     <p>Select a conversation to start messaging</p>
                   </div>
                 </div>
               ) : (
                 <>
                   {/* Messages Area */}
-                  <div className="flex-1 p-4 overflow-y-auto max-h-[400px]">
+                  <ScrollArea className="flex-1 p-4 h-[400px]">
                     <div className="space-y-4">
                       {messages.map((message) => (
                         <div
                           key={message.id}
                           className={`flex ${
                             message.sender_id === user?.id ? 'justify-end' : 'justify-start'
                           }`}
                         >
                            <div
                              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                                message.sender_id === user?.id
                                  ? 'bg-primary text-primary-foreground'
                                  : 'bg-muted'
                              }`}
                            >
                              <div className="flex items-center justify-between mb-1">
                                <p className="text-xs font-medium opacity-80">
                                  {message.sender_id === user?.id ? 'You' : message.sender.name}
                                </p>
                                <p className="text-xs opacity-70">
                                  {new Date(message.created_at).toLocaleTimeString()}
                                </p>
                              </div>
                              <p className="text-sm">{message.content}</p>
                            </div>
                         </div>
                       ))}
                     </div>
-                  </div>
+                  </ScrollArea>

                   {/* Message Input */}
                   <div className="border-t p-4">
                     <form onSubmit={sendMessage} className="flex space-x-2">
                       <Input
                         value={newMessage}
                         onChange={(e) => setNewMessage(e.target.value)}
                         placeholder="Type your message..."
                         className="flex-1"
                         disabled={sending}
                       />
                       <Button type="submit" disabled={sending || !newMessage.trim()}>
                         <Send className="h-4 w-4" />
                       </Button>
                     </form>
                   </div>
                 </>
               )}
             </CardContent>
           </Card>
         </div>
       </div>
     </div>
   );
 };

 export default Messages;