import React, { useEffect, useState, useRef } from 'react';
import GuestLayout from '@/Layouts/GuestLayout';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

const Chat = ({ auth }) => {
    const [ws, setWs] = useState(null);
    const [messages, setMessages] = useState([]);
    const [chats, setChats] = useState([]);
    const [selectedChat, setSelectedChat] = useState(null);
    const [partnerName, setPartnerName] = useState('');
    const [newMessage, setNewMessage] = useState('');
    const userId = auth.user.id; // Logged-in user's ID
    const messagesEndRef = useRef(null); // Reference to the end of the message list
    const audioRef = useRef(null); // Reference to the audio element

    const playSound = () => {
        if (audioRef.current) {
            audioRef.current.play();
        }
    };

    const requestNotificationPermission = async () => {
        if (Notification.permission !== 'granted') {
            await Notification.requestPermission();
        }
    };

    const showNotification = (message) => {
        const notificationContent = message.content.startsWith('/')
            ? 'Вы успешно получили отклик' // Specific message for links
            : message.content; // Actual message content if not a link

        if (Notification.permission === 'granted' && document.visibilityState !== 'visible') {
            new Notification('Новое сообщение | Jumystap', {
                body: `${partnerName}\n${notificationContent}`,
                icon: '/icon.png',
            });
        }
    };

    useEffect(() => {
        const socket = new WebSocket(`wss://api.jumystap.kz/api/v1/ws?user_id=${userId}`);

        socket.onopen = () => {
            console.log('WebSocket is open now.');
        };

        socket.onmessage = (event) => {
            const message = JSON.parse(event.data);
            setMessages((prevMessages) => [...prevMessages, message]);

            // Play sound and show notification for new messages
            if (message.sender_id !== userId) {
                playSound();
                showNotification(message);
            }
        };

        socket.onclose = () => {
            console.log('WebSocket is closed now.');
        };

        setWs(socket);

        // Request permission for notifications when the component mounts
        requestNotificationPermission();

        return () => {
            socket.close();
        };
    }, [userId]);

    useEffect(() => {
        const fetchChats = async () => {
            const response = await fetch(`https://api.jumystap.kz/api/v1/chats?user_id=${userId}`);
            const data = await response.json();
            setChats(data);

            if (data.length > 0) {
                const latestChat = data.reduce((prev, current) => {
                    return new Date(prev.created_at) > new Date(current.created_at) ? prev : current;
                });
                setSelectedChat(latestChat.partner_id);
            }
        };

        fetchChats();
    }, [userId]);

    useEffect(() => {
        const fetchMessages = async () => {
            if (selectedChat) {
                const response = await fetch(`https://api.jumystap.kz/api/v1/messages?sender_id=${userId}&receiver_id=${selectedChat}`);
                const data = await response.json();
                setMessages(data);

                if (chats) {
                    const selectedChatInfo = chats.find(chat => chat.partner_id === selectedChat);
                    if (selectedChatInfo) {
                        setPartnerName(selectedChatInfo.partner_name);
                    }
                }

                scrollToBottom();
            }
        };

        fetchMessages();
    }, [selectedChat, chats, userId]);

    // Scroll to the bottom of the message list
    const scrollToBottom = () => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    // Send a new message
    const handleSendMessage = (e) => {
        e.preventDefault();
        if (ws && newMessage && selectedChat) {
            const message = {
                sender_id: userId,
                receiver_id: selectedChat,
                content: newMessage,
                created_at: new Date().toISOString() // Ensure the message has a timestamp
            };
            ws.send(JSON.stringify(message));
            setNewMessage(''); // Clear the input field

            // Scroll to the bottom after sending the message
            scrollToBottom();
        }
    };

    return (
        <div>
            <GuestLayout>
                <div className="flex h-screen">
                    <div className="w-2/3 flex flex-col p-4">
                        {selectedChat ? (
                            <>
                                <div className="flex flex-col flex-grow mb-4">
                                    <h2 className="text-lg font-semibold mb-4">{partnerName}</h2>
                                    <div className="flex-grow h-[700px] overflow-y-auto bg-gray-50 p-4 rounded-lg border">
                                        <ul className="space-y-4">
                                            {messages.map((msg) => {
                                                const isLink = msg.content.startsWith('/'); // Check if the message is a link
                                                return (
                                                    <li
                                                        key={msg.id}
                                                        className={`flex ${
                                                            msg.sender_id === userId ? 'justify-end' : 'justify-start'
                                                        }`}
                                                    >
                                                        <div>
                                                            <div
                                                                className={`max-w-xs px-4 py-2 rounded-lg shadow-md ${
                                                                    msg.sender_id === userId
                                                                        ? 'bg-blue-500 text-white'
                                                                        : 'bg-gray-100'
                                                                }`}
                                                            >
                                                                {msg.sender_id === userId ? (
                                                                    <div>
                                                                        <div className="text-xs text-right">Вы</div>
                                                                        {isLink ? (
                                                                            <a
                                                                                href={msg.content}
                                                                                className="text-white underline hover:text-blue-300"
                                                                            >
                                                                               Вы отправили резюме
                                                                            </a>
                                                                        ) : (
                                                                            <p>{msg.content}</p>
                                                                        )}
                                                                    </div>
                                                                ) : (
                                                                    <div>
                                                                        <div className="text-xs text-left">{partnerName}</div>
                                                                        {isLink ? (
                                                                            <a
                                                                                href={msg.content}
                                                                                className="text-blue-700 underline hover:text-blue-500"
                                                                            >
                                                                                Резюме соискателя
                                                                            </a>
                                                                        ) : (
                                                                            <p>{msg.content}</p>
                                                                        )}
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <div className="text-xs text-gray-500 mt-2">Отправлено</div>
                                                        </div>
                                                    </li>
                                                );
                                            })}
                                            <div ref={messagesEndRef} />
                                        </ul>
                                    </div>
                                </div>

                                <form onSubmit={handleSendMessage} className="flex items-center space-x-3">
                                    <input
                                        type="text"
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        placeholder="Введите сообщение..."
                                        className="flex-grow px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <button
                                        type="submit"
                                        className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                                    >
                                        Отправить
                                    </button>
                                </form>
                            </>
                        ) : (
                            <div className="flex items-center justify-center h-full text-gray-500">
                                <p>Выберите чат для получения сообщении</p>
                            </div>
                        )}
                    </div>
                    <div className="w-1/3 bg-gray-100 p-4 overflow-y-auto border-r">
                        <h2 className="text-lg font-semibold mb-4">Чаты</h2>
                        <ul className="space-y-2">
                            {chats && chats.length > 0 && (
                                <>
                                    {chats.map((chat) => (
                                        <li
                                            key={chat.partner_id}
                                            onClick={() => setSelectedChat(chat.partner_id)}
                                            className={`p-3 rounded-lg cursor-pointer bg-white shadow-md hover:bg-blue-100 transition ${
                                                selectedChat === chat.partner_id ? 'bg-blue-100' : ''
                                            }`}
                                        >
                                            <p className="font-medium">{chat.partner_name}</p>
                                            <p className="text-sm text-gray-600 truncate">{chat.last_message}</p>
                                        </li>
                                    ))}
                                </>
                            )}
                        </ul>
                    </div>
                </div>
            </GuestLayout>

            {/* Audio element for notification sound */}
            <audio ref={audioRef} src="/notification-sound.mp3" preload="auto" />
        </div>
    );
};

export default Chat;
