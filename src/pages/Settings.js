import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
    Box,
    Container,
    Paper,
    Typography,
    TextField,
    Button,
    Switch,
    FormControlLabel,
    Divider,
    Alert,
    Grid
} from '@mui/material';

const Settings = () => {
    const user = useSelector((state) => state.auth.user);
    const dispatch = useDispatch();
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    
    const [profileData, setProfileData] = useState({
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
        email: user?.email || '',
        phone: user?.phone || ''
    });

    const [notifications, setNotifications] = useState({
        emailNotifications: true,
        goalReminders: true,
        messageNotifications: true,
        weeklyProgress: true
    });

    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const handleProfileChange = (e) => {
        const { name, value } = e.target;
        setProfileData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleNotificationChange = (e) => {
        const { name, checked } = e.target;
        setNotifications(prev => ({
            ...prev,
            [name]: checked
        }));
    };

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleProfileSubmit = async (e) => {
        e.preventDefault();
        setSuccess('');
        setError('');

        try {
            const response = await fetch('http://localhost:8080/api/users/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(profileData)
            });

            if (response.ok) {
                setSuccess('Профиль успешно обновлен');
            } else {
                const data = await response.json();
                setError(data.message || 'Ошибка при обновлении профиля');
            }
        } catch (err) {
            setError('Ошибка сервера. Попробуйте позже.');
        }
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        setSuccess('');
        setError('');

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setError('Пароли не совпадают');
            return;
        }

        try {
            const response = await fetch('http://localhost:8080/api/users/password', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    currentPassword: passwordData.currentPassword,
                    newPassword: passwordData.newPassword
                })
            });

            if (response.ok) {
                setSuccess('Пароль успешно изменен');
                setPasswordData({
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                });
            } else {
                const data = await response.json();
                setError(data.message || 'Ошибка при изменении пароля');
            }
        } catch (err) {
            setError('Ошибка сервера. Попробуйте позже.');
        }
    };

    const handleNotificationsSubmit = async (e) => {
        e.preventDefault();
        setSuccess('');
        setError('');

        try {
            const response = await fetch('http://localhost:8080/api/users/notifications', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(notifications)
            });

            if (response.ok) {
                setSuccess('Настройки уведомлений обновлены');
            } else {
                const data = await response.json();
                setError(data.message || 'Ошибка при обновлении настроек');
            }
        } catch (err) {
            setError('Ошибка сервера. Попробуйте позже.');
        }
    };

    return (
        <Container maxWidth="md">
            <Box sx={{ mt: 4, mb: 4 }}>
                <Typography variant="h4" gutterBottom>
                    Настройки
                </Typography>

                {success && (
                    <Alert severity="success" sx={{ mb: 2 }}>
                        {success}
                    </Alert>
                )}
                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}

                <Paper sx={{ p: 3, mb: 3 }}>
                    <Typography variant="h6" gutterBottom>
                        Личная информация
                    </Typography>
                    <Box component="form" onSubmit={handleProfileSubmit}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Имя"
                                    name="firstName"
                                    value={profileData.firstName}
                                    onChange={handleProfileChange}
                                    margin="normal"
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Фамилия"
                                    name="lastName"
                                    value={profileData.lastName}
                                    onChange={handleProfileChange}
                                    margin="normal"
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Email"
                                    name="email"
                                    type="email"
                                    value={profileData.email}
                                    onChange={handleProfileChange}
                                    margin="normal"
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Телефон"
                                    name="phone"
                                    value={profileData.phone}
                                    onChange={handleProfileChange}
                                    margin="normal"
                                />
                            </Grid>
                        </Grid>
                        <Button
                            type="submit"
                            variant="contained"
                            sx={{ mt: 2 }}
                        >
                            Сохранить изменения
                        </Button>
                    </Box>
                </Paper>

                <Paper sx={{ p: 3, mb: 3 }}>
                    <Typography variant="h6" gutterBottom>
                        Изменить пароль
                    </Typography>
                    <Box component="form" onSubmit={handlePasswordSubmit}>
                        <TextField
                            fullWidth
                            label="Текущий пароль"
                            name="currentPassword"
                            type="password"
                            value={passwordData.currentPassword}
                            onChange={handlePasswordChange}
                            margin="normal"
                        />
                        <TextField
                            fullWidth
                            label="Новый пароль"
                            name="newPassword"
                            type="password"
                            value={passwordData.newPassword}
                            onChange={handlePasswordChange}
                            margin="normal"
                        />
                        <TextField
                            fullWidth
                            label="Подтвердите новый пароль"
                            name="confirmPassword"
                            type="password"
                            value={passwordData.confirmPassword}
                            onChange={handlePasswordChange}
                            margin="normal"
                        />
                        <Button
                            type="submit"
                            variant="contained"
                            sx={{ mt: 2 }}
                        >
                            Изменить пароль
                        </Button>
                    </Box>
                </Paper>

                <Paper sx={{ p: 3 }}>
                    <Typography variant="h6" gutterBottom>
                        Настройки уведомлений
                    </Typography>
                    <Box component="form" onSubmit={handleNotificationsSubmit}>
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={notifications.emailNotifications}
                                    onChange={handleNotificationChange}
                                    name="emailNotifications"
                                />
                            }
                            label="Email уведомления"
                        />
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={notifications.goalReminders}
                                    onChange={handleNotificationChange}
                                    name="goalReminders"
                                />
                            }
                            label="Напоминания о целях"
                        />
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={notifications.messageNotifications}
                                    onChange={handleNotificationChange}
                                    name="messageNotifications"
                                />
                            }
                            label="Уведомления о сообщениях"
                        />
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={notifications.weeklyProgress}
                                    onChange={handleNotificationChange}
                                    name="weeklyProgress"
                                />
                            }
                            label="Еженедельный отчет о прогрессе"
                        />
                        <Divider sx={{ my: 2 }} />
                        <Button
                            type="submit"
                            variant="contained"
                        >
                            Сохранить настройки
                        </Button>
                    </Box>
                </Paper>
            </Box>
        </Container>
    );
};

export default Settings; 