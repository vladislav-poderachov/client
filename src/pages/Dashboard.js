import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
    Grid,
    Paper,
    Typography,
    Box,
    CircularProgress,
    Card,
    CardContent,
    List,
    ListItem,
    ListItemText,
    Divider,
    Button,
    LinearProgress,
    ListItemAvatar,
    Avatar,
    Alert
} from '@mui/material';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import axios from 'axios';
import {
    Flag as FlagIcon,
    TrendingUp as TrendingUpIcon,
    Message as MessageIcon,
    Article as ArticleIcon,
    CheckCircle as CheckCircleIcon,
    Warning as WarningIcon
} from '@mui/icons-material';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

// Создаем экземпляр axios с базовым URL
const api = axios.create({
    baseURL: 'http://localhost:8080/api'
});

// Добавляем перехватчик для добавления токена к запросам
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

const Dashboard = () => {
    const { user } = useSelector((state) => state.auth);
    const [goals, setGoals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [recentPosts, setRecentPosts] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }

        const fetchData = async () => {
            try {
                setError(null);
                const [goalsResponse, postsResponse] = await Promise.all([
                    api.get(`/goals/user/${user.id}`),
                    api.get('/publications')
                ]);
                setGoals(goalsResponse.data);
                setRecentPosts(postsResponse.data.slice(0, 5));
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
                setError('Ошибка при загрузке данных. Пожалуйста, попробуйте позже.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [user, navigate]);

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ mt: 2 }}>
                <Alert severity="error">{error}</Alert>
            </Box>
        );
    }

    const progressData = {
        labels: goals.map(goal => goal.title),
        datasets: [
            {
                label: 'Прогресс целей',
                data: goals.map(goal => goal.progress || 0),
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1,
            },
        ],
    };

    const stats = {
        totalGoals: goals.length,
        completedGoals: goals.filter(goal => goal.progress === 100).length,
        activeGoals: goals.filter(goal => goal.progress < 100).length,
        messages: 3,
        posts: recentPosts.length
    };

    const recentGoals = goals.filter(goal => goal.progress < 100);
    const recentMessages = [
        {
            id: 1,
            sender: 'Иван Петров',
            content: 'Привет! Как продвигается изучение React?',
            time: '10:30'
        },
        {
            id: 2,
            sender: 'Мария Сидорова',
            content: 'Не забудь про встречу в 15:00',
            time: '09:15'
        }
    ];

    const recentPostsList = recentPosts.map((post) => ({
        id: post.id,
        title: post.title,
        author: post.author,
        likes: post.likes,
        comments: post.comments
    }));

    const StatCard = ({ title, value, icon, color }) => (
        <Card>
            <CardContent>
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        mb: 2
                    }}
                >
                    <Avatar
                        sx={{
                            bgcolor: `${color}.light`,
                            color: `${color}.main`,
                            mr: 2
                        }}
                    >
                        {icon}
                    </Avatar>
                    <Typography variant="h6" component="div">
                        {title}
                    </Typography>
                </Box>
                <Typography variant="h4" component="div" sx={{ mb: 1 }}>
                    {value}
                </Typography>
            </CardContent>
        </Card>
    );

    return (
        <Box>
            <Typography variant="h4" component="h1" gutterBottom>
                Дашборд
            </Typography>

            {/* Статистика */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="Всего целей"
                        value={stats.totalGoals}
                        icon={<FlagIcon />}
                        color="primary"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="Выполнено"
                        value={stats.completedGoals}
                        icon={<CheckCircleIcon />}
                        color="success"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="Активные"
                        value={stats.activeGoals}
                        icon={<TrendingUpIcon />}
                        color="warning"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="Сообщения"
                        value={stats.messages}
                        icon={<MessageIcon />}
                        color="info"
                    />
                </Grid>
            </Grid>

            {/* График прогресса */}
            <Paper sx={{ p: 3, mb: 4 }}>
                <Typography variant="h6" gutterBottom>
                    Прогресс целей
                </Typography>
                <Box sx={{ height: 300 }}>
                    <Line data={progressData} options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                            y: {
                                beginAtZero: true,
                                max: 100
                            }
                        }
                    }} />
                </Box>
            </Paper>

            {/* Последние цели */}
            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            Активные цели
                        </Typography>
                        <List>
                            {recentGoals.map((goal) => (
                                <React.Fragment key={goal.id}>
                                    <ListItem>
                                        <ListItemText
                                            primary={goal.title}
                                            secondary={`Прогресс: ${goal.progress}%`}
                                        />
                                    </ListItem>
                                    <LinearProgress
                                        variant="determinate"
                                        value={goal.progress}
                                        sx={{ mx: 2, mb: 2 }}
                                    />
                                </React.Fragment>
                            ))}
                        </List>
                    </Paper>
                </Grid>

                {/* Последние сообщения */}
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            Последние сообщения
                        </Typography>
                        <List>
                            {recentMessages.map((message) => (
                                <React.Fragment key={message.id}>
                                    <ListItem>
                                        <ListItemAvatar>
                                            <Avatar>{message.sender[0]}</Avatar>
                                        </ListItemAvatar>
                                        <ListItemText
                                            primary={message.sender}
                                            secondary={
                                                <>
                                                    <Typography component="span" variant="body2">
                                                        {message.content}
                                                    </Typography>
                                                    <br />
                                                    <Typography component="span" variant="caption" color="text.secondary">
                                                        {message.time}
                                                    </Typography>
                                                </>
                                            }
                                        />
                                    </ListItem>
                                    <Divider variant="inset" component="li" />
                                </React.Fragment>
                            ))}
                        </List>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Dashboard; 