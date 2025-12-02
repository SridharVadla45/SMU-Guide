import { useEffect, useState } from 'react';
import { apiClient } from '../api/client';
import type { Conversation, Message, User } from '../types';
import { Search, Plus, Send } from 'lucide-react';

const Messages = () => {
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [activeConversationId, setActiveConversationId] = useState<number | null>(1);
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [currentUser] = useState<User>({ id: 1 } as User); // Assume logged in as user 1

    useEffect(() => {
        const fetchConversations = async () => {
            try {
                const data = await apiClient.getConversations(currentUser.id);
                setConversations(data);
            } catch (error) {
                console.error('Error fetching conversations:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchConversations();
    }, [currentUser.id]);

    useEffect(() => {
        const fetchMessages = async () => {
            if (activeConversationId) {
                try {
                    const data = await apiClient.getMessages(activeConversationId);
                    setMessages(data);
                } catch (error) {
                    console.error('Error fetching messages:', error);
                }
            }
        };

        fetchMessages();
    }, [activeConversationId]);

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !activeConversationId) return;

        const message: Message = {
            id: Date.now(),
            conversationId: activeConversationId,
            senderId: currentUser.id,
            content: newMessage,
            createdAt: new Date().toISOString(),
            sender: currentUser,
        };

        setMessages([...messages, message]);
        setNewMessage('');
    };

    const getOtherParticipant = (conversation: Conversation) => {
        return conversation.participants?.find((p) => p.id !== currentUser.id);
    };

    const formatTime = (dateString: string) => {
        return new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString();
    };

    if (loading) {
        return <div className="flex items-center justify-center h-full">Loading...</div>;
    }

    const activeConversation = conversations.find((c) => c.id === activeConversationId);
    const activeParticipant = activeConversation ? getOtherParticipant(activeConversation) : null;

    return (
        <div className="space-y-6 h-[calc(100vh-140px)] flex flex-col">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
                <p className="text-gray-500 mt-1">Connect with mentors and students</p>
            </div>

            <div className="flex gap-6 flex-1 min-h-0">
                {/* Sidebar */}
                <div className="w-1/3 bg-white rounded-xl border border-gray-200 flex flex-col">
                    <div className="p-4 border-b border-gray-100 space-y-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Search conversations..."
                                className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                        <button className="w-full flex items-center justify-center gap-2 bg-black text-white py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors">
                            <Plus size={16} />
                            Start New Conversation
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto">
                        {conversations.map((conversation) => {
                            const otherUser = getOtherParticipant(conversation);
                            const isActive = conversation.id === activeConversationId;
                            const isUnread = conversation.id === 2; // Hardcoded for demo matching screenshot

                            return (
                                <div
                                    key={conversation.id}
                                    onClick={() => setActiveConversationId(conversation.id)}
                                    className={`p-4 border-b border-gray-50 cursor-pointer transition-colors hover:bg-gray-50 ${isActive ? 'bg-blue-50/50' : ''
                                        }`}
                                >
                                    <div className="flex gap-3">
                                        <div className="relative">
                                            <img
                                                src={otherUser?.avatarUrl}
                                                alt={otherUser?.name}
                                                className="w-10 h-10 rounded-full object-cover"
                                            />
                                            {/* Online indicator could go here */}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-start mb-1">
                                                <h3 className="text-sm font-semibold text-gray-900 truncate">
                                                    {otherUser?.name}
                                                </h3>
                                                {isUnread && (
                                                    <span className="bg-black text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                                                        1
                                                    </span>
                                                )}
                                            </div>
                                            <p className={`text-xs truncate ${isUnread ? 'font-medium text-gray-900' : 'text-gray-500'}`}>
                                                {conversation.lastMessage?.content}
                                            </p>
                                            <p className="text-[10px] text-gray-400 mt-1">
                                                {conversation.lastMessage && formatDate(conversation.lastMessage.createdAt)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Chat Area */}
                <div className="flex-1 bg-white rounded-xl border border-gray-200 flex flex-col">
                    {activeConversation ? (
                        <>
                            {/* Chat Header */}
                            <div className="p-4 border-b border-gray-100 flex items-center gap-3">
                                <img
                                    src={activeParticipant?.avatarUrl}
                                    alt={activeParticipant?.name}
                                    className="w-10 h-10 rounded-full object-cover"
                                />
                                <div>
                                    <h2 className="text-sm font-semibold text-gray-900">
                                        {activeParticipant?.name}
                                    </h2>
                                    <p className="text-xs text-gray-500 capitalize">
                                        {activeParticipant?.role?.toLowerCase()}
                                    </p>
                                </div>
                            </div>

                            {/* Messages List */}
                            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                                {messages.map((message) => {
                                    const isMe = message.senderId === currentUser.id;
                                    return (
                                        <div
                                            key={message.id}
                                            className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                                        >
                                            <div className="flex items-end gap-2 max-w-[70%]">
                                                {!isMe && (
                                                    <img
                                                        src={message.sender?.avatarUrl}
                                                        alt={message.sender?.name}
                                                        className="w-6 h-6 rounded-full object-cover mb-1"
                                                    />
                                                )}
                                                <div>
                                                    <div
                                                        className={`p-3 rounded-2xl text-sm ${isMe
                                                            ? 'bg-blue-600 text-white rounded-br-none'
                                                            : 'bg-gray-100 text-gray-900 rounded-bl-none'
                                                            }`}
                                                    >
                                                        {message.content}
                                                    </div>
                                                    <p className={`text-[10px] text-gray-400 mt-1 ${isMe ? 'text-right' : 'text-left'}`}>
                                                        {formatTime(message.createdAt)}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Input Area */}
                            <div className="p-4 border-t border-gray-100">
                                <form onSubmit={handleSendMessage} className="relative">
                                    <input
                                        type="text"
                                        placeholder="Type a message..."
                                        className="w-full pl-4 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                    />
                                    <button
                                        type="submit"
                                        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
                                    >
                                        <Send size={16} />
                                    </button>
                                </form>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex items-center justify-center text-gray-500">
                            Select a conversation to start messaging
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Messages;
