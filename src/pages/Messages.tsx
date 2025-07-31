import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Send, Search, Filter, Phone, Video, MoreVertical } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { useState } from "react";

export default function Messages() {
  const [selectedConversation, setSelectedConversation] = useState(0);
  const [messageText, setMessageText] = useState("");

  const conversations = [
    {
      id: 1,
      name: "Ahmed El Mansouri",
      role: "Carrier",
      avatar: "AM",
      lastMessage: "Shipment is on schedule, ETA 2 hours",
      time: "2m ago",
      unread: 2,
      online: true
    },
    {
      id: 2,
      name: "Sarah Johnson", 
      role: "Shipper",
      avatar: "SJ",
      lastMessage: "Can we schedule pickup for tomorrow?",
      time: "15m ago",
      unread: 0,
      online: false
    },
    {
      id: 3,
      name: "LoadHive Support",
      role: "Support",
      avatar: "LH",
      lastMessage: "Your ticket has been resolved",
      time: "1h ago",
      unread: 1,
      online: true
    },
    {
      id: 4,
      name: "Hassan Ouali",
      role: "Carrier",
      avatar: "HO",
      lastMessage: "Need route confirmation for Madrid delivery",
      time: "3h ago",
      unread: 0,
      online: false
    }
  ];

  const messages = [
    {
      id: 1,
      sender: "Ahmed El Mansouri",
      message: "Hi! I'm currently en route to your pickup location.",
      time: "10:30 AM",
      isMe: false
    },
    {
      id: 2,
      sender: "You",
      message: "Great! What's your estimated arrival time?",
      time: "10:32 AM",
      isMe: true
    },
    {
      id: 3,
      sender: "Ahmed El Mansouri", 
      message: "Should be there in about 2 hours. Traffic is lighter than expected.",
      time: "10:35 AM",
      isMe: false
    },
    {
      id: 4,
      sender: "You",
      message: "Perfect, we'll have everything ready for loading.",
      time: "10:36 AM", 
      isMe: true
    },
    {
      id: 5,
      sender: "Ahmed El Mansouri",
      message: "Shipment is on schedule, ETA 2 hours",
      time: "11:45 AM",
      isMe: false
    }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Messages</h1>
            <p className="text-muted-foreground mt-2">
              Communicate with carriers, shippers, and support
            </p>
          </div>
          <Button>
            <MessageCircle className="h-4 w-4 mr-2" />
            New Message
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
          {/* Conversations List */}
          <Card className="lg:col-span-1">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle>Conversations</CardTitle>
                <Button variant="ghost" size="sm">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search conversations..." className="pl-10" />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-1">
                {conversations.map((conversation, index) => (
                  <div
                    key={conversation.id}
                    onClick={() => setSelectedConversation(index)}
                    className={`p-4 cursor-pointer hover:bg-accent/50 transition-colors border-b ${
                      selectedConversation === index ? 'bg-accent/20 border-l-4 border-l-primary' : ''
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium">{conversation.avatar}</span>
                        </div>
                        {conversation.online && (
                          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-background"></div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium truncate">{conversation.name}</p>
                          <span className="text-xs text-muted-foreground">{conversation.time}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-muted-foreground truncate">{conversation.lastMessage}</p>
                          {conversation.unread > 0 && (
                            <Badge className="bg-primary text-primary-foreground text-xs h-5 w-5 p-0 flex items-center justify-center">
                              {conversation.unread}
                            </Badge>
                          )}
                        </div>
                        <Badge variant="outline" className="text-xs mt-1">
                          {conversation.role}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Chat Area */}
          <Card className="lg:col-span-2">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium">{conversations[selectedConversation]?.avatar}</span>
                  </div>
                  <div>
                    <p className="font-medium">{conversations[selectedConversation]?.name}</p>
                    <p className="text-sm text-muted-foreground">{conversations[selectedConversation]?.role}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm">
                    <Phone className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Video className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex flex-col h-[470px]">
              {/* Messages */}
              <div className="flex-1 space-y-4 overflow-y-auto mb-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.isMe ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[70%] p-3 rounded-lg ${
                        message.isMe
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted'
                      }`}
                    >
                      <p className="text-sm">{message.message}</p>
                      <p className={`text-xs mt-1 ${
                        message.isMe ? 'text-primary-foreground/70' : 'text-muted-foreground'
                      }`}>
                        {message.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Message Input */}
              <div className="flex items-center space-x-2">
                <Input
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && messageText.trim()) {
                      // Handle send message
                      setMessageText("");
                    }
                  }}
                />
                <Button size="sm" disabled={!messageText.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}