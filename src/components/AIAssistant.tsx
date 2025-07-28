import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  MessageCircle, 
  Send, 
  Bot, 
  User, 
  Truck, 
  Package, 
  MapPin,
  X,
  Minimize2,
  Maximize2,
  Sparkles,
  Clock
} from "lucide-react";

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  suggestions?: string[];
  matchResults?: MatchResult[];
}

interface MatchResult {
  id: string;
  type: 'load' | 'truck';
  title: string;
  route?: string;
  price: string;
  match: number;
  details: string;
}

const AIAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      content: 'Hello! I\'m your AI logistics assistant. I can help you find the perfect matches for your shipping needs. What can I help you with today?',
      timestamp: new Date(),
      suggestions: [
        'Find trucks for Casablanca to Madrid',
        'Show me loads going to Europe',
        'What are the best rates today?',
        'Help me optimize my route'
      ]
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const simulateAIResponse = (userMessage: string): Message => {
    const lowerMessage = userMessage.toLowerCase();
    
    // Simulate AI processing and response based on keywords
    if (lowerMessage.includes('truck') || lowerMessage.includes('carrier')) {
      return {
        id: Date.now().toString(),
        type: 'bot',
        content: 'I found several trucks that match your criteria. Here are the best AI-matched options:',
        timestamp: new Date(),
        matchResults: [
          {
            id: 'T1',
            type: 'truck',
            title: 'EuroTrans Logistics - Refrigerated 40ft',
            route: 'Currently in Casablanca',
            price: '€2.50/km',
            match: 95,
            details: 'Available tomorrow, verified carrier with 4.8 rating'
          },
          {
            id: 'T2', 
            type: 'truck',
            title: 'Atlas Freight - Container 20ft',
            route: 'Currently in Tangier',
            price: '€2.20/km',
            match: 89,
            details: 'Express service, 12 years experience'
          }
        ],
        suggestions: ['Book EuroTrans', 'Compare all options', 'Show availability calendar', 'Get detailed quotes']
      };
    }
    
    if (lowerMessage.includes('load') || lowerMessage.includes('shipment')) {
      return {
        id: Date.now().toString(),
        type: 'bot',
        content: 'Here are the best load opportunities based on your profile and current location:',
        timestamp: new Date(),
        matchResults: [
          {
            id: 'L1',
            type: 'load',
            title: 'Electronics - Urgent Shipment',
            route: 'Casablanca → Madrid',
            price: '€2,800',
            match: 96,
            details: '15 tons, pickup tomorrow 9 AM, refrigerated required'
          },
          {
            id: 'L2',
            type: 'load', 
            title: 'Auto Parts Export',
            route: 'Tangier → Barcelona',
            price: '€1,650',
            match: 92,
            details: '8 tons, flexible pickup time, standard trailer'
          }
        ],
        suggestions: ['Bid on electronics load', 'Show route details', 'Calculate profit margin', 'View shipper profile']
      };
    }

    if (lowerMessage.includes('rate') || lowerMessage.includes('price')) {
      return {
        id: Date.now().toString(),
        type: 'bot',
        content: 'Based on current market analysis, here are today\'s competitive rates for Europe-Africa routes:\n\n• Morocco → Spain: €2.20-2.80/km\n• Morocco → France: €2.50-3.20/km\n• Morocco → Italy: €2.80-3.50/km\n• Morocco → Germany: €3.00-3.80/km\n\nPrices are 15% higher than last month due to increased demand.',
        timestamp: new Date(),
        suggestions: ['Show detailed breakdown', 'Compare with last month', 'Get route recommendations', 'Set price alerts']
      };
    }

    if (lowerMessage.includes('optimize') || lowerMessage.includes('route')) {
      return {
        id: Date.now().toString(),
        type: 'bot',
        content: 'I can help optimize your routes! For maximum efficiency, I recommend:\n\n1. Combine loads going to similar destinations\n2. Use return loads to minimize empty miles\n3. Consider fuel stops and rest requirements\n4. Check border crossing times\n\nWould you like me to analyze your specific route?',
        timestamp: new Date(),
        suggestions: ['Analyze my current routes', 'Find return loads', 'Check border wait times', 'Fuel optimization tips']
      };
    }

    // Default response
    return {
      id: Date.now().toString(),
      type: 'bot',
      content: 'I understand you need help with logistics. I can assist you with:\n\n• Finding trucks and carriers\n• Discovering profitable loads\n• Route optimization\n• Market rates and pricing\n• Documentation assistance\n• Real-time tracking\n\nWhat specific area would you like help with?',
      timestamp: new Date(),
      suggestions: ['Find trucks', 'Show available loads', 'Check market rates', 'Optimize routes']
    };
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI processing delay
    setTimeout(() => {
      const botResponse = simulateAIResponse(inputValue);
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          className="rounded-full h-14 w-14 shadow-glow"
          variant="hero"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Card className={`shadow-elegant transition-all duration-300 ${isMinimized ? 'w-80 h-16' : 'w-96 h-[600px]'}`}>
        <CardHeader className="p-4 bg-gradient-hero text-white rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="bg-white/20 p-1 rounded-full">
                <Bot className="h-4 w-4" />
              </div>
              <div>
                <CardTitle className="text-sm">AI Logistics Assistant</CardTitle>
                {!isMinimized && <p className="text-xs text-white/80">Online • Ready to help</p>}
              </div>
            </div>
            <div className="flex items-center space-x-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMinimized(!isMinimized)}
                className="h-8 w-8 p-0 text-white hover:bg-white/20"
              >
                {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="h-8 w-8 p-0 text-white hover:bg-white/20"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        {!isMinimized && (
          <>
            <CardContent className="flex-1 p-0 overflow-hidden flex flex-col h-[500px]">
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] ${message.type === 'user' ? 'bg-primary text-primary-foreground' : 'bg-accent/10'} rounded-lg p-3`}>
                      <div className="flex items-start space-x-2">
                        {message.type === 'bot' && (
                          <div className="bg-primary/10 p-1 rounded-full mt-1">
                            <Bot className="h-3 w-3 text-primary" />
                          </div>
                        )}
                        <div className="flex-1">
                          <p className="text-sm whitespace-pre-line">{message.content}</p>
                          
                          {/* Match Results */}
                          {message.matchResults && (
                            <div className="mt-3 space-y-2">
                              {message.matchResults.map((result) => (
                                <div key={result.id} className="bg-background border rounded-lg p-3">
                                  <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center space-x-2">
                                      {result.type === 'truck' ? (
                                        <Truck className="h-4 w-4 text-primary" />
                                      ) : (
                                        <Package className="h-4 w-4 text-accent" />
                                      )}
                                      <span className="font-medium text-sm">{result.title}</span>
                                    </div>
                                    <Badge variant="accent" className="text-xs">
                                      {result.match}% Match
                                    </Badge>
                                  </div>
                                  {result.route && (
                                    <p className="text-xs text-muted-foreground flex items-center mb-1">
                                      <MapPin className="h-3 w-3 mr-1" />
                                      {result.route}
                                    </p>
                                  )}
                                  <p className="text-xs text-muted-foreground mb-2">{result.details}</p>
                                  <div className="flex items-center justify-between">
                                    <span className="font-bold text-primary">{result.price}</span>
                                    <Button variant="premium" size="sm">
                                      {result.type === 'truck' ? 'Book Now' : 'Bid Now'}
                                    </Button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Suggestions */}
                          {message.suggestions && (
                            <div className="mt-3 flex flex-wrap gap-1">
                              {message.suggestions.map((suggestion, index) => (
                                <Button
                                  key={index}
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleSuggestionClick(suggestion)}
                                  className="text-xs h-7"
                                >
                                  {suggestion}
                                </Button>
                              ))}
                            </div>
                          )}

                          <p className="text-xs text-muted-foreground mt-1">
                            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-accent/10 rounded-lg p-3 flex items-center space-x-2">
                      <div className="bg-primary/10 p-1 rounded-full">
                        <Bot className="h-3 w-3 text-primary" />
                      </div>
                      <div className="flex items-center space-x-1">
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="border-t p-4">
                <div className="flex space-x-2">
                  <Input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask me about loads, trucks, routes..."
                    className="flex-1"
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!inputValue.trim() || isTyping}
                    variant="hero"
                    size="icon"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex items-center justify-center mt-2">
                  <Badge variant="secondary" className="text-xs">
                    <Sparkles className="h-3 w-3 mr-1" />
                    Powered by AI
                  </Badge>
                </div>
              </div>
            </CardContent>
          </>
        )}
      </Card>
    </div>
  );
};

export default AIAssistant;