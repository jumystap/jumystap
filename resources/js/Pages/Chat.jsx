import React, { useEffect, useState, useRef } from 'react';
import GuestLayout from '@/Layouts/GuestLayout';

const ChatInterface = ({ auth }) => {
    const [ws, setWs] = useState(null);
    const [messages, setMessages] = useState([]);
    const [chats, setChats] = useState([]);
    const [selectedChat, setSelectedChat] = useState(null);
    const [partnerName, setPartnerName] = useState('');
    const [newMessage, setNewMessage] = useState('');
    const [isMobileView, setIsMobileView] = useState(false);
    const [showMessages, setShowMessages] = useState(false);
    const userId = auth.user.id;
    const messagesEndRef = useRef(null);
    const audioRef = useRef(null);

    useEffect(() => {
        const handleResize = () => {
            setIsMobileView(window.innerWidth < 768);
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const playSound = () => {
        if (audioRef.current) {
            audioRef.current.play();
        }
    };

    const handleChatSelect = (chatId) => {
        setSelectedChat(chatId);
        if (isMobileView) {
            setShowMessages(true);
        }
    };

    const handleBackToChats = () => {
        setShowMessages(false);
    };

    // WebSocket setup
    useEffect(() => {
        const socket = new WebSocket(`wss://api.jumystap.kz/api/v1/ws?user_id=${userId}`);
        
        socket.onopen = () => console.log('WebSocket connected');
        
        socket.onmessage = (event) => {
            const message = JSON.parse(event.data);
            setMessages(prev => [...prev, message]);
            if (message.sender_id !== userId) {
                playSound();
            }
        };
        
        setWs(socket);
        return () => socket.close();
    }, [userId]);

    // Fetch chats
    useEffect(() => {
        const fetchChats = async () => {
            const response = await fetch(`https://api.jumystap.kz/api/v1/chats?user_id=${userId}`);
            const data = await response.json();
            setChats(data);
            if (data.length > 0 && !selectedChat) {
                const latestChat = data.reduce((prev, current) => 
                    new Date(prev.created_at) > new Date(current.created_at) ? prev : current
                );
                setSelectedChat(latestChat.partner_id);
            }
        };
        fetchChats();
    }, [userId]);

    // Fetch messages
    useEffect(() => {
        const fetchMessages = async () => {
            if (selectedChat) {
                const response = await fetch(`https://api.jumystap.kz/api/v1/messages?sender_id=${userId}&receiver_id=${selectedChat}`);
                const data = await response.json();
                setMessages(data);
                const selectedChatInfo = chats.find(chat => chat.partner_id === selectedChat);
                if (selectedChatInfo) {
                    setPartnerName(selectedChatInfo.partner_name);
                }
                messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
            }
        };
        fetchMessages();
    }, [selectedChat, chats, userId]);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (ws && newMessage && selectedChat) {
            const message = {
                sender_id: userId,
                receiver_id: selectedChat,
                content: newMessage,
                created_at: new Date().toISOString()
            };
            ws.send(JSON.stringify(message));
            setNewMessage('');
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const ChatsList = () => (
        <div className="h-full overflow-y-auto bg-gray-50 p-4">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Сообщения</h2>
            <div className="space-y-2">
                {chats.map((chat) => (
                    <div
                        key={chat.partner_id}
                        onClick={() => handleChatSelect(chat.partner_id)}
                        className={`p-4 rounded-lg cursor-pointer transition-all ${
                            selectedChat === chat.partner_id
                            ? 'bg-blue-50 border-blue-500'
                            : 'bg-white hover:bg-gray-50'
                        } shadow-sm border`}
                    >
                        <div className="flex items-center space-x-3">
                            <div className="flex-1 min-w-0">
                                <p className="font-semibold text-gray-900 truncate">
                                    {chat.partner_name}
                                </p>
                                <p className="text-sm text-gray-500 truncate">
                                    {chat.last_message}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    const MessagesView = () => (
        <div className="flex flex-col h-full">
            <div className="bg-white border-b p-4 flex items-center">
                {isMobileView && (
                    <button
                        onClick={handleBackToChats}
                        className="mr-4 text-gray-600 hover:text-gray-900"
                    >
                        ← Назад
                    </button>
                )}
                <h2 className="text-lg font-semibold">{partnerName}</h2>
            </div>
            <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
                <div className="space-y-4">
                    {messages.map((msg, index) => {
                        const isLink = msg.content.startsWith('/');
                        return (
                            <div
                                key={msg.id || index}
                                className={`flex ${msg.sender_id === userId ? 'justify-end' : 'justify-start'}`}
                            >
                                <div className={`max-w-[75%] break-words ${
                                    msg.sender_id === userId ? 'bg-blue-500 text-white' : 'bg-white'
                                } rounded-lg px-4 py-2 shadow-sm`}>
                                    <div className="text-xs mb-1">
                                        {msg.sender_id === userId ? 'Вы' : partnerName}
                                    </div>
                                    {isLink ? (
                                        <a
                                            href={msg.content}
                                            className={`underline ${
                                                msg.sender_id === userId
                                                    ? 'text-white hover:text-blue-100'
                                                    : 'text-blue-500 hover:text-blue-700'
                                            }`}
                                        >
                                            {msg.sender_id === userId ? 'Вы отправили резюме' : 'Резюме соискателя'}
                                        </a>
                                    ) : (
                                        <p>{msg.content}</p>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                    <div ref={messagesEndRef} />
                </div>
            </div>
            <form onSubmit={handleSendMessage} className="p-4 bg-white border-t">
                <div className="flex space-x-2">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Введите сообщение..."
                        className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        type="submit"
                        className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                        Отправить
                    </button>
                </div>
            </form>
        </div>
    );

    return (
        <GuestLayout>
            <div className="h-screen bg-white">
                <div className="h-full md:flex">
                    <div className={`${
                        isMobileView ? 'h-full' : 'w-1/3 border-r'
                    } ${isMobileView && showMessages ? 'hidden' : 'block'}`}>
                        <ChatsList />
                    </div>
                    <div className={`${
                        isMobileView ? 'h-full' : 'flex-1'
                    } ${isMobileView && !showMessages ? 'hidden' : 'block'}`}>
                        {selectedChat ? (
                            <MessagesView />
                        ) : (
                            <div className="h-full flex items-center justify-center text-gray-500">
                                <p>Выберите чат для начала общения</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <audio ref={audioRef} src="/notification-sound.mp3" preload="auto" />
        </GuestLayout>
    );
};

export default ChatInterface;
