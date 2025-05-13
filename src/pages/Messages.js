import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Grid,
    Card,
    CardContent,
    TextField,
    IconButton,
    List,
    ListItem,
    ListItemText,
    ListItemAvatar,
    Avatar,
    Divider,
    useTheme,
    useMediaQuery,
    Paper
} from '@mui/material';
import {
    Send as SendIcon,
    AttachFile as AttachFileIcon
} from '@mui/icons-material';
import { useSelector } from 'react-redux';
import * as messageService from '../services/MessageService';

const Messages = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const { user } = useSelector((state) => state.auth);

    const [selectedChat, setSelectedChat] = useState(null);
    const [message, setMessage] = useState('');
    const [chats, setChats] = useState([]);
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Загрузка списка чатов
    useEffect(() => {
        const loadChats = async () => {
            try {
                setLoading(true);
                const response = await messageService.getUserMessages(user.id);
                const userMessages = response.data;
                
                // Группируем сообщения по чатам
                const chatMap = new Map();
                userMessages.forEach(msg => {
                    const chatId = msg.senderId === user.id ? msg.recipientId : msg.senderId;
                    const chatName = msg.senderId === user.id ? msg.recipientLogin : msg.senderLogin;
                    
                    if (!chatMap.has(chatId)) {
                        chatMap.set(chatId, {
                            id: chatId,
                            user: {
                                id: chatId,
                                name: chatName,
                                avatar: `https://i.pravatar.cc/150?img=${chatId}`
                            },
                            lastMessage: msg.content,
                            lastMessageTime: new Date(msg.createdAt).toLocaleTimeString(),
                            unread: msg.isRead ? 0 : 1
                        });
                    } else {
                        const chat = chatMap.get(chatId);
                        if (new Date(msg.createdAt) > new Date(chat.lastMessageTime)) {
                            chat.lastMessage = msg.content;
                            chat.lastMessageTime = new Date(msg.createdAt).toLocaleTimeString();
                            chat.unread = msg.isRead ? chat.unread : chat.unread + 1;
                        }
                    }
                });
                
                setChats(Array.from(chatMap.values()));
            } catch (err) {
                setError('Ошибка при загрузке чатов');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        if (user?.id) {
            loadChats();
        }
    }, [user]);

    // Загрузка сообщений выбранного чата
    useEffect(() => {
        const loadMessages = async () => {
            if (!selectedChat) return;

            try {
                setLoading(true);
                const response = await messageService.getChatMessages(selectedChat.id);
                const chatMessages = response.data.map(msg => ({
                    id: msg.id,
                    sender: {
                        id: msg.senderId,
                        name: msg.senderLogin,
                        avatar: `https://i.pravatar.cc/150?img=${msg.senderId}`
                    },
                    content: msg.content,
                    timestamp: new Date(msg.createdAt).toLocaleTimeString(),
                    isRead: msg.isRead
                }));
                
                setMessages(chatMessages);
                
                // Отмечаем сообщения как прочитанные
                if (chatMessages.some(msg => !msg.isRead && msg.sender.id !== user.id)) {
                    await messageService.markAllChatMessagesAsRead(selectedChat.id);
                }
            } catch (err) {
                setError('Ошибка при загрузке сообщений');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        loadMessages();
    }, [selectedChat, user]);

    const handleChatSelect = (chat) => {
        setSelectedChat(chat);
    };

    const handleSendMessage = async () => {
        if (!message.trim() || !selectedChat) return;

        try {
            const newMessage = {
                recipientId: selectedChat.id,
                content: message
            };

            const response = await messageService.sendMessage(newMessage);
            const sentMessage = response.data;

            setMessages(prev => [...prev, {
                id: sentMessage.id,
                sender: {
                    id: user.id,
                    name: user.name,
                    avatar: user.avatar
                },
                content: sentMessage.content,
                timestamp: new Date(sentMessage.createdAt).toLocaleTimeString(),
                isRead: true
            }]);

            setMessage('');

            // Обновляем последнее сообщение в чате
            setChats(prev =>
                prev.map(chat =>
                    chat.id === selectedChat.id
                        ? {
                            ...chat,
                            lastMessage: message,
                            lastMessageTime: 'Только что',
                            unread: 0
                        }
                        : chat
                )
            );
        } catch (err) {
            setError('Ошибка при отправке сообщения');
            console.error(err);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                <Typography>Загрузка...</Typography>
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                <Typography color="error">{error}</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ height: 'calc(100vh - 200px)' }}>
            <Grid container spacing={2} sx={{ height: '100%' }}>
                {/* Список чатов */}
                <Grid
                    item
                    xs={12}
                    md={4}
                    sx={{
                        height: '100%',
                        display: { xs: selectedChat ? 'none' : 'block', md: 'block' }
                    }}
                >
                    <Card sx={{ height: '100%' }}>
                        <CardContent sx={{ p: 0 }}>
                            <List>
                                {chats.map((chat) => (
                                    <React.Fragment key={chat.id}>
                                        <ListItem
                                            button
                                            selected={selectedChat?.id === chat.id}
                                            onClick={() => handleChatSelect(chat)}
                                        >
                                            <ListItemAvatar>
                                                <Avatar src={chat.user.avatar} />
                                            </ListItemAvatar>
                                            <ListItemText
                                                primary={
                                                    <Box
                                                        sx={{
                                                            display: 'flex',
                                                            justifyContent: 'space-between',
                                                            alignItems: 'center'
                                                        }}
                                                    >
                                                        <Typography variant="subtitle1">
                                                            {chat.user.name}
                                                        </Typography>
                                                        <Typography
                                                            variant="caption"
                                                            color="text.secondary"
                                                        >
                                                            {chat.lastMessageTime}
                                                        </Typography>
                                                    </Box>
                                                }
                                                secondary={
                                                    <Box
                                                        sx={{
                                                            display: 'flex',
                                                            justifyContent: 'space-between',
                                                            alignItems: 'center'
                                                        }}
                                                    >
                                                        <Typography
                                                            variant="body2"
                                                            color="text.secondary"
                                                            sx={{
                                                                overflow: 'hidden',
                                                                textOverflow: 'ellipsis',
                                                                whiteSpace: 'nowrap',
                                                                maxWidth: '200px'
                                                            }}
                                                        >
                                                            {chat.lastMessage}
                                                        </Typography>
                                                        {chat.unread > 0 && (
                                                            <Box
                                                                sx={{
                                                                    bgcolor: 'primary.main',
                                                                    color: 'white',
                                                                    borderRadius: '50%',
                                                                    minWidth: 20,
                                                                    height: 20,
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    justifyContent: 'center',
                                                                    fontSize: '0.75rem'
                                                                }}
                                                            >
                                                                {chat.unread}
                                                            </Box>
                                                        )}
                                                    </Box>
                                                }
                                            />
                                        </ListItem>
                                        <Divider />
                                    </React.Fragment>
                                ))}
                            </List>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Область сообщений */}
                <Grid
                    item
                    xs={12}
                    md={8}
                    sx={{
                        height: '100%',
                        display: { xs: selectedChat ? 'block' : 'none', md: 'block' }
                    }}
                >
                    {selectedChat ? (
                        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                            {/* Заголовок чата */}
                            <Box
                                sx={{
                                    p: 2,
                                    borderBottom: 1,
                                    borderColor: 'divider',
                                    display: 'flex',
                                    alignItems: 'center'
                                }}
                            >
                                <Avatar
                                    src={selectedChat.user.avatar}
                                    sx={{ mr: 2 }}
                                />
                                <Typography variant="h6">
                                    {selectedChat.user.name}
                                </Typography>
                            </Box>

                            {/* Сообщения */}
                            <Box
                                sx={{
                                    flexGrow: 1,
                                    overflow: 'auto',
                                    p: 2,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: 2
                                }}
                            >
                                {messages.map((msg) => (
                                    <Box
                                        key={msg.id}
                                        sx={{
                                            display: 'flex',
                                            justifyContent:
                                                msg.sender.id === user.id
                                                    ? 'flex-end'
                                                    : 'flex-start'
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                maxWidth: '70%'
                                            }}
                                        >
                                            {msg.sender.id !== user.id && (
                                                <Typography
                                                    variant="caption"
                                                    color="text.secondary"
                                                    sx={{ mb: 0.5 }}
                                                >
                                                    {msg.sender.name}
                                                </Typography>
                                            )}
                                            <Paper
                                                elevation={1}
                                                sx={{
                                                    p: 2,
                                                    bgcolor:
                                                        msg.sender.id === user.id
                                                            ? 'primary.main'
                                                            : 'grey.100',
                                                    color:
                                                        msg.sender.id === user.id
                                                            ? 'white'
                                                            : 'text.primary',
                                                    borderRadius: 2
                                                }}
                                            >
                                                <Typography variant="body1">
                                                    {msg.content}
                                                </Typography>
                                            </Paper>
                                            <Typography
                                                variant="caption"
                                                color="text.secondary"
                                                sx={{ mt: 0.5, alignSelf: 'flex-end' }}
                                            >
                                                {msg.timestamp}
                                            </Typography>
                                        </Box>
                                    </Box>
                                ))}
                            </Box>

                            {/* Поле ввода сообщения */}
                            <Box
                                sx={{
                                    p: 2,
                                    borderTop: 1,
                                    borderColor: 'divider',
                                    display: 'flex',
                                    gap: 1
                                }}
                            >
                                <IconButton>
                                    <AttachFileIcon />
                                </IconButton>
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    placeholder="Введите сообщение..."
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    multiline
                                    maxRows={4}
                                    size="small"
                                />
                                <IconButton
                                    color="primary"
                                    onClick={handleSendMessage}
                                    disabled={!message.trim()}
                                >
                                    <SendIcon />
                                </IconButton>
                            </Box>
                        </Card>
                    ) : (
                        <Box
                            sx={{
                                height: '100%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            <Typography variant="h6" color="text.secondary">
                                Выберите чат для начала общения
                            </Typography>
                        </Box>
                    )}
                </Grid>
            </Grid>
        </Box>
    );
};

export default Messages; 