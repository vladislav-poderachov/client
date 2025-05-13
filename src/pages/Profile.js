import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
    Box,
    Container,
    Paper,
    Typography,
    Avatar,
    Tab,
    Tabs,
    Grid,
    Card,
    CardContent,
    LinearProgress,
    Chip,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    Divider
} from '@mui/material';
import {
    EmojiEvents as TrophyIcon,
    Star as StarIcon,
    Timeline as TimelineIcon,
    CheckCircle as CheckCircleIcon
} from '@mui/icons-material';
import Character3D from '../components/Character3D';

const TabPanel = (props) => {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`profile-tabpanel-${index}`}
            aria-labelledby={`profile-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    {children}
                </Box>
            )}
        </div>
    );
};

const Profile = () => {
    const user = useSelector((state) => state.auth.user);
    const [tabValue, setTabValue] = useState(0);
    const [goals, setGoals] = useState([]);
    const [achievements, setAchievements] = useState([]);
    const [statistics, setStatistics] = useState({
        completedGoals: 0,
        totalGoals: 0,
        averageProgress: 0,
        rank: 'Новичок',
        experience: 0,
        nextRankProgress: 0
    });

    useEffect(() => {
        // Здесь будет загрузка данных пользователя
        fetchUserData();
    }, []);

    const fetchUserData = async () => {
        try {
            // Загрузка целей
            const goalsResponse = await fetch(`http://localhost:8080/api/goals/user/${user.id}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            const goalsData = await goalsResponse.json();
            setGoals(goalsData);

            // Загрузка достижений
            const achievementsResponse = await fetch(`http://localhost:8080/api/achievements/user/${user.id}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            const achievementsData = await achievementsResponse.json();
            setAchievements(achievementsData);

            // Загрузка статистики
            const statsResponse = await fetch(`http://localhost:8080/api/users/${user.id}/statistics`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            const statsData = await statsResponse.json();
            setStatistics(statsData);
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    return (
        <Container maxWidth="lg">
            <Box sx={{ mt: 4, mb: 4 }}>
                <Paper sx={{ p: 3, mb: 3 }}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={4}>
                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <Avatar
                                    src={user.avatar}
                                    sx={{ width: 120, height: 120, mb: 2 }}
                                />
                                <Typography variant="h5" gutterBottom>
                                    {user.firstName} {user.lastName}
                                </Typography>
                                <Typography variant="body1" color="text.secondary" gutterBottom>
                                    {user.email}
                                </Typography>
                                <Chip
                                    icon={<StarIcon />}
                                    label={statistics.rank}
                                    color="primary"
                                    sx={{ mt: 1 }}
                                />
                            </Box>
                        </Grid>
                        <Grid item xs={12} md={8}>
                            <Box sx={{ height: 300 }}>
                                <Character3D />
                            </Box>
                        </Grid>
                    </Grid>
                </Paper>

                <Paper sx={{ width: '100%' }}>
                    <Tabs
                        value={tabValue}
                        onChange={handleTabChange}
                        indicatorColor="primary"
                        textColor="primary"
                        centered
                    >
                        <Tab label="Статистика" />
                        <Tab label="Цели" />
                        <Tab label="Достижения" />
                    </Tabs>

                    <TabPanel value={tabValue} index={0}>
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={6}>
                                <Card>
                                    <CardContent>
                                        <Typography variant="h6" gutterBottom>
                                            Прогресс развития
                                        </Typography>
                                        <Box sx={{ mb: 2 }}>
                                            <Typography variant="body2" color="text.secondary">
                                                Опыт до следующего уровня
                                            </Typography>
                                            <LinearProgress
                                                variant="determinate"
                                                value={statistics.nextRankProgress}
                                                sx={{ mt: 1 }}
                                            />
                                        </Box>
                                        <Typography variant="body2">
                                            Выполнено целей: {statistics.completedGoals} из {statistics.totalGoals}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Card>
                                    <CardContent>
                                        <Typography variant="h6" gutterBottom>
                                            Общая статистика
                                        </Typography>
                                        <List>
                                            <ListItem>
                                                <ListItemIcon>
                                                    <CheckCircleIcon color="success" />
                                                </ListItemIcon>
                                                <ListItemText
                                                    primary="Завершенные цели"
                                                    secondary={`${statistics.completedGoals} целей`}
                                                />
                                            </ListItem>
                                            <ListItem>
                                                <ListItemIcon>
                                                    <TimelineIcon color="primary" />
                                                </ListItemIcon>
                                                <ListItemText
                                                    primary="Средний прогресс"
                                                    secondary={`${statistics.averageProgress}%`}
                                                />
                                            </ListItem>
                                            <ListItem>
                                                <ListItemIcon>
                                                    <TrophyIcon color="warning" />
                                                </ListItemIcon>
                                                <ListItemText
                                                    primary="Опыт"
                                                    secondary={`${statistics.experience} XP`}
                                                />
                                            </ListItem>
                                        </List>
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid>
                    </TabPanel>

                    <TabPanel value={tabValue} index={1}>
                        <Grid container spacing={3}>
                            {goals.map((goal) => (
                                <Grid item xs={12} md={6} key={goal.id}>
                                    <Card>
                                        <CardContent>
                                            <Typography variant="h6" gutterBottom>
                                                {goal.title}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary" paragraph>
                                                {goal.description}
                                            </Typography>
                                            <Box sx={{ mt: 2 }}>
                                                <Typography variant="body2" color="text.secondary">
                                                    Прогресс
                                                </Typography>
                                                <LinearProgress
                                                    variant="determinate"
                                                    value={goal.progress}
                                                    sx={{ mt: 1 }}
                                                />
                                            </Box>
                                            <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                                                <Chip
                                                    label={goal.category}
                                                    size="small"
                                                    color="primary"
                                                    variant="outlined"
                                                />
                                                <Chip
                                                    label={goal.status}
                                                    size="small"
                                                    color={goal.status === 'Завершено' ? 'success' : 'default'}
                                                />
                                            </Box>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    </TabPanel>

                    <TabPanel value={tabValue} index={2}>
                        <Grid container spacing={3}>
                            {achievements.map((achievement) => (
                                <Grid item xs={12} md={4} key={achievement.id}>
                                    <Card>
                                        <CardContent>
                                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                                <TrophyIcon color="warning" sx={{ mr: 1 }} />
                                                <Typography variant="h6">
                                                    {achievement.title}
                                                </Typography>
                                            </Box>
                                            <Typography variant="body2" color="text.secondary" paragraph>
                                                {achievement.description}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                Получено: {new Date(achievement.dateEarned).toLocaleDateString()}
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    </TabPanel>
                </Paper>
            </Box>
        </Container>
    );
};

export default Profile; 