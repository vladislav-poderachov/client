import axios from 'axios';

const REST_API_BASE_URL = 'http://localhost:8080/api/messages';

export const sendMessage = (message) => 
    axios.post(REST_API_BASE_URL, message);

export const getMessage = (messageId) => 
    axios.get(`${REST_API_BASE_URL}/${messageId}`);

export const getUserMessages = (userId) => 
    axios.get(`${REST_API_BASE_URL}/user/${userId}`);

export const getChatMessages = (chatId) => 
    axios.get(`${REST_API_BASE_URL}/chat/${chatId}`);

export const markMessageAsRead = (messageId) => 
    axios.post(`${REST_API_BASE_URL}/${messageId}/read`);

export const markAllChatMessagesAsRead = (chatId) => 
    axios.post(`${REST_API_BASE_URL}/chat/${chatId}/read-all`);

export const getUnreadMessagesCount = () => 
    axios.get(`${REST_API_BASE_URL}/unread/count`); 