import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
    Box,
    Typography,
    Grid,
    Card,
    CardContent,
    Tabs,
    Tab,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Avatar,
    IconButton,
    Chip,
    useTheme,
    useMediaQuery
} from '@mui/material';
import {
    Block as BlockIcon,
    CheckCircle as CheckCircleIcon,
    Warning as WarningIcon,
    Delete as DeleteIcon,
    Visibility as VisibilityIcon
} from '@mui/icons-material';
import axios from 'axios';

const Admin = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const { user } = useSelector((state) => state.auth);
    const [activeTab, setActiveTab] = useState(0);
    const [users, setUsers] = useState([]);
    const [reportedContent, setReportedContent] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [selectedContent, setSelectedContent] = useState(null);
    const [openUserDialog, setOpenUserDialog] = useState(false);
    const [openContentDialog, setOpenContentDialog] = useState(false);
    const [blockReason, setBlockReason] = useState('');

    useEffect(() => {
        if (user?.role === 'ADMIN') {
            fetchUsers();
            fetchReportedContent();
        }
    }, [user]);

    const fetchUsers = async () => {
        try {
            const response = await axios.get('/api/admin/users');
            setUsers(response.data);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const fetchReportedContent = async () => {
        try {
            const response = await axios.get('/api/admin/reported-content');
            setReportedContent(response.data);
        } catch (error) {
            console.error('Error fetching reported content:', error);
        }
    };

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    const handleBlockUser = async (userId) => {
        try {
            await axios.post(`/api/admin/users/${userId}/block`, { reason: blockReason });
            fetchUsers();
            setOpenUserDialog(false);
            setBlockReason('');
        } catch (error) {
            console.error('Error blocking user:', error);
        }
    };

    const handleUnblockUser = async (userId) => {
        try {
            await axios.post(`/api/admin/users/${userId}/unblock`);
            fetchUsers();
        } catch (error) {
            console.error('Error unblocking user:', error);
        }
    };

    const handleDeleteContent = async (contentId) => {
        try {
            await axios.delete(`/api/admin/content/${contentId}`);
            fetchReportedContent();
            setOpenContentDialog(false);
        } catch (error) {
            console.error('Error deleting content:', error);
        }
    };

    const handleViewUser = (user) => {
        setSelectedUser(user);
        setOpenUserDialog(true);
    };

    const handleViewContent = (content) => {
        setSelectedContent(content);
        setOpenContentDialog(true);
    };

    if (user?.role !== 'ADMIN') {
        return (
            <Box sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="h5" color="error">
                    Доступ запрещен
                </Typography>
            </Box>
        );
    }

    return (
        <Box>
            <Typography variant="h4" gutterBottom>
                Панель администратора
            </Typography>

            <Card sx={{ mb: 3 }}>
                <CardContent>
                    <Tabs value={activeTab} onChange={handleTabChange}>
                        <Tab label="Пользователи" />
                        <Tab label="Жалобы" />
                        <Tab label="Статистика" />
                    </Tabs>
                </CardContent>
            </Card>

            {activeTab === 0 && (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Пользователь</TableCell>
                                <TableCell>Email</TableCell>
                                <TableCell>Роль</TableCell>
                                <TableCell>Статус</TableCell>
                                <TableCell>Действия</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {users.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell>
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            <Avatar src={user.avatar} sx={{ mr: 2 }} />
                                            {user.login}
                                        </Box>
                                    </TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>{user.role}</TableCell>
                                    <TableCell>
                                        <Chip
                                            label={user.isBlocked ? 'Заблокирован' : 'Активен'}
                                            color={user.isBlocked ? 'error' : 'success'}
                                            size="small"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <IconButton
                                            size="small"
                                            onClick={() => handleViewUser(user)}
                                        >
                                            <VisibilityIcon />
                                        </IconButton>
                                        {user.isBlocked ? (
                                            <IconButton
                                                size="small"
                                                color="success"
                                                onClick={() => handleUnblockUser(user.id)}
                                            >
                                                <CheckCircleIcon />
                                            </IconButton>
                                        ) : (
                                            <IconButton
                                                size="small"
                                                color="error"
                                                onClick={() => handleBlockUser(user.id)}
                                            >
                                                <BlockIcon />
                                            </IconButton>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            {activeTab === 1 && (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Тип контента</TableCell>
                                <TableCell>Автор</TableCell>
                                <TableCell>Причина жалобы</TableCell>
                                <TableCell>Статус</TableCell>
                                <TableCell>Действия</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {reportedContent.map((content) => (
                                <TableRow key={content.id}>
                                    <TableCell>{content.type}</TableCell>
                                    <TableCell>{content.author.login}</TableCell>
                                    <TableCell>{content.reportReason}</TableCell>
                                    <TableCell>
                                        <Chip
                                            label={content.status}
                                            color={
                                                content.status === 'PENDING'
                                                    ? 'warning'
                                                    : content.status === 'APPROVED'
                                                    ? 'success'
                                                    : 'error'
                                            }
                                            size="small"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <IconButton
                                            size="small"
                                            onClick={() => handleViewContent(content)}
                                        >
                                            <VisibilityIcon />
                                        </IconButton>
                                        <IconButton
                                            size="small"
                                            color="error"
                                            onClick={() => handleDeleteContent(content.id)}
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            {activeTab === 2 && (
                <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    Общая статистика
                                </Typography>
                                {/* Здесь можно добавить графики и статистику */}
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    Активность пользователей
                                </Typography>
                                {/* Здесь можно добавить графики активности */}
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            )}

            {/* Диалог просмотра пользователя */}
            <Dialog
                open={openUserDialog}
                onClose={() => setOpenUserDialog(false)}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>
                    Информация о пользователе
                </DialogTitle>
                <DialogContent>
                    {selectedUser && (
                        <Box sx={{ mt: 2 }}>
                            <Grid container spacing={2}>
                                <Grid item xs={12} md={4}>
                                    <Avatar
                                        src={selectedUser.avatar}
                                        sx={{ width: 150, height: 150 }}
                                    />
                                </Grid>
                                <Grid item xs={12} md={8}>
                                    <Typography variant="h6">
                                        {selectedUser.login}
                                    </Typography>
                                    <Typography color="text.secondary">
                                        Email: {selectedUser.email}
                                    </Typography>
                                    <Typography color="text.secondary">
                                        Роль: {selectedUser.role}
                                    </Typography>
                                    <Typography color="text.secondary">
                                        Дата регистрации: {new Date(selectedUser.createdAt).toLocaleDateString()}
                                    </Typography>
                                    {selectedUser.isBlocked && (
                                        <Typography color="error">
                                            Причина блокировки: {selectedUser.blockReason}
                                        </Typography>
                                    )}
                                </Grid>
                            </Grid>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenUserDialog(false)}>
                        Закрыть
                    </Button>
                    {selectedUser && !selectedUser.isBlocked && (
                        <>
                            <TextField
                                label="Причина блокировки"
                                value={blockReason}
                                onChange={(e) => setBlockReason(e.target.value)}
                                fullWidth
                                sx={{ mx: 2 }}
                            />
                            <Button
                                color="error"
                                onClick={() => handleBlockUser(selectedUser.id)}
                                disabled={!blockReason}
                            >
                                Заблокировать
                            </Button>
                        </>
                    )}
                </DialogActions>
            </Dialog>

            {/* Диалог просмотра контента */}
            <Dialog
                open={openContentDialog}
                onClose={() => setOpenContentDialog(false)}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>
                    Просмотр контента
                </DialogTitle>
                <DialogContent>
                    {selectedContent && (
                        <Box sx={{ mt: 2 }}>
                            <Typography variant="h6" gutterBottom>
                                {selectedContent.type}
                            </Typography>
                            <Typography color="text.secondary" gutterBottom>
                                Автор: {selectedContent.author.login}
                            </Typography>
                            <Typography color="text.secondary" gutterBottom>
                                Причина жалобы: {selectedContent.reportReason}
                            </Typography>
                            {selectedContent.type === 'IMAGE' && (
                                <Box sx={{ mt: 2 }}>
                                    <img
                                        src={selectedContent.url}
                                        alt="Reported content"
                                        style={{ maxWidth: '100%', maxHeight: '400px' }}
                                    />
                                </Box>
                            )}
                            {selectedContent.type === 'POST' && (
                                <Box sx={{ mt: 2 }}>
                                    <Typography variant="body1">
                                        {selectedContent.content}
                                    </Typography>
                                </Box>
                            )}
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenContentDialog(false)}>
                        Закрыть
                    </Button>
                    <Button
                        color="error"
                        onClick={() => handleDeleteContent(selectedContent.id)}
                    >
                        Удалить
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default Admin; 