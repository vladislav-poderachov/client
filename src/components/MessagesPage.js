import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import './MessagesPage.css';

const MessagesPage = () => {
    const { username } = useAuth();
    const [conversations, setConversations] = useState([]);
    const [activeConversation, setActiveConversation] = useState(null);
    const [newMessage, setNewMessage] = useState('');

    useEffect(() => {
        // Загрузка диалогов из localStorage
        const loadConversations = () => {
            const messages = JSON.parse(localStorage.getItem('messages')) || {};
            const userConversations = messages[username] || [];
            setConversations(userConversations);
        };

        loadConversations();
    }, [username]);

    const handleSendMessage = () => {
        if (!newMessage.trim() || !activeConversation) return;

        const updatedMessages = JSON.parse(localStorage.getItem('messages')) || {};
        const conversationId = activeConversation.id;

        if (!updatedMessages[username]) {
            updatedMessages[username] = [];
        }

        const conversation = updatedMessages[username].find(c => c.id === conversationId) || {
            id: conversationId,
            withUser: activeConversation.withUser,
            messages: []
        };

        conversation.messages.push({
            id: Date.now(),
            from: username,
            text: newMessage,
            timestamp: new Date().toISOString()
        });

        if (!updatedMessages[username].some(c => c.id === conversationId)) {
            updatedMessages[username].push(conversation);
        }

        // Обновляем сообщения у получателя
        if (!updatedMessages[activeConversation.withUser]) {
            updatedMessages[activeConversation.withUser] = [];
        }

        const recipientConversation = updatedMessages[activeConversation.withUser].find(c => c.id === conversationId) || {
            id: conversationId,
            withUser: username,
            messages: []
        };

        recipientConversation.messages.push({
            id: Date.now(),
            from: username,
            text: newMessage,
            timestamp: new Date().toISOString()
        });

        if (!updatedMessages[activeConversation.withUser].some(c => c.id === conversationId)) {
            updatedMessages[activeConversation.withUser].push(recipientConversation);
        }

        localStorage.setItem('messages', JSON.stringify(updatedMessages));
        setNewMessage('');
        setConversations(updatedMessages[username]);
    };

    return (
        <div className="messages-container">
            <div className="conversations-list">
                <h2>Диалоги</h2>
                {conversations.length === 0 ? (
                    <p>У вас пока нет диалогов</p>
                ) : (
                    <ul>
                        {conversations.map(conv => (
                            <li
                                key={conv.id}
                                className={activeConversation?.id === conv.id ? 'active' : ''}
                                onClick={() => setActiveConversation(conv)}
                            >
                                <span className="user">{conv.withUser}</span>
                                <span className="preview">
                                    {conv.messages[conv.messages.length - 1]?.text}
                                </span>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            <div className="chat-area">
                {activeConversation ? (
                    <>
                        <div className="chat-header">
                            <h3>Диалог с {activeConversation.withUser}</h3>
                        </div>
                        <div className="messages">
                            {activeConversation.messages.map(msg => (
                                <div
                                    key={msg.id}
                                    className={`message ${msg.from === username ? 'sent' : 'received'}`}
                                >
                                    <p>{msg.text}</p>
                                    <span className="time">
                                        {new Date(msg.timestamp).toLocaleTimeString()}
                                    </span>
                                </div>
                            ))}
                        </div>
                        <div className="message-input">
                            <input
                                type="text"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                placeholder="Введите сообщение..."
                                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                            />
                            <button onClick={handleSendMessage}>Отправить</button>
                        </div>
                    </>
                ) : (
                    <div className="no-conversation">
                        <p>Выберите диалог или начните новый</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MessagesPage;