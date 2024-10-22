import React, { useEffect, useState } from 'react';
import GuestLayout from '@/Layouts/GuestLayout';

const Chat = ({ auth }) => {
    const [ws, setWs] = useState(null);
    const [messages, setMessages] = useState([]);
    const [chats, setChats] = useState([]);
    const [selectedChat, setSelectedChat] = useState(null);
    const [partnerName, setPartnerName] = useState(''); // Store partner's name
    const [newMessage, setNewMessage] = useState('');
    const userId = auth.user.id; // Logged-in user's ID

    // Connect to WebSocket
    useEffect(() => {
        const socket = new WebSocket(`ws://localhost:8080/api/v1/ws?user_id=${userId}`);

        socket.onopen = () => {
            console.log('WebSocket is open now.');
        };

        socket.onmessage = (event) => {
            const message = JSON.parse(event.data);
            setMessages((prevMessages) => [...prevMessages, message]);
        };

        socket.onclose = () => {
            console.log('WebSocket is closed now.');
        };

        setWs(socket);

        return () => {
            socket.close();
        };
    }, []);

    // Fetch chats when component mounts
    useEffect(() => {
        const fetchChats = async () => {
            const response = await fetch(`http://localhost:8080/api/v1/chats?user_id=${userId}`);
            const data = await response.json();
            setChats(data);
        };

        fetchChats();
    }, []);

    // Fetch messages when a chat is selected
    useEffect(() => {
        const fetchMessages = async () => {
            if (selectedChat) {
                const response = await fetch(`http://localhost:8080/api/v1/messages?sender_id=${userId}&receiver_id=${selectedChat}`);
                const data = await response.json();
                setMessages(data);

                // Find partner name from the selected chat
                const selectedChatInfo = chats.find(chat => chat.partner_id === selectedChat);
                if (selectedChatInfo) {
                    setPartnerName(selectedChatInfo.partner_name);
                }
            }
        };

        fetchMessages();
    }, [selectedChat]);

    // Send a new message
    const handleSendMessage = (e) => {
        e.preventDefault();
        if (ws && newMessage && selectedChat) {
            const message = {
                sender_id: userId, // Include the sender ID
                receiver_id: selectedChat,
                content: newMessage,
            };
            ws.send(JSON.stringify(message));
            setNewMessage(''); // Clear the input field
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
                                            {messages.map(msg => (
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
                                                            <div className='text-xs text-right'>Вы</div>
                                                            <p>{msg.content}</p>
                                                            </div>
                                                        ) : (
                                                            <div>
                                                            <div className='text-xs text-left'>{partnerName}</div>
                                                            <p>{msg.content}</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className='text-xs text-gray-500 mt-2'>Отправлено {msg.created_at}</div>
                                                    </div>
                                                </li>
                                            ))}
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
                            {chats.map(chat => (
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
                        </ul>
                    </div>
                </div>
            </GuestLayout>
        </div>
    );
};

export default Chat;

