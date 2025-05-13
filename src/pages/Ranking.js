import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Card,
    CardContent,
    Grid,
    Tabs,
    Tab,
    Avatar,
    Chip,
    LinearProgress,
    useTheme,
    useMediaQuery
} from '@mui/material';
import {
    EmojiEvents as TrophyIcon,
    TrendingUp as TrendingUpIcon,
    Category as CategoryIcon
} from '@mui/icons-material';
import axios from 'axios';

const Ranking = () => {
    const [users, setUsers] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [loading, setLoading] = useState(true);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const categories = [
        { id: 'all', name: 'Общий рейтинг', icon: <TrophyIcon /> },
        { id: 'fitness', name: 'Фитнес', icon: <TrendingUpIcon /> },
        { id: 'education', name: 'Образование', icon: <CategoryIcon /> },
        { id: 'career', name: 'Карьера', icon: <TrendingUpIcon /> },
        { id: 'personal', name: 'Личное развитие', icon: <CategoryIcon /> }
    ];

    useEffect(() => {
        fetchUsers();
    }, [selectedCategory]);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`/api/users/ranking?category=${selectedCategory}`);
            setUsers(response.data);
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCategoryChange = (event, newValue) => {
        setSelectedCategory(newValue);
    };

    const getRankColor = (rank) => {
        switch (rank) {
            case 1:
                return theme.palette.warning.main;
            case 2:
                return theme.palette.grey[400];
            case 3:
                return theme.palette.error.main;
            default:
                return theme.palette.primary.main;
        }
    };

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
                Рейтинг пользователей
            </Typography>

            <Tabs
                value={selectedCategory}
                onChange={handleCategoryChange}
                variant={isMobile ? "scrollable" : "fullWidth"}
                scrollButtons={isMobile ? "auto" : false}
                sx={{ mb: 3 }}
            >
                {categories.map((category) => (
                    <Tab
                        key={category.id}
                        value={category.id}
                        label={category.name}
                        icon={category.icon}
                        iconPosition="start"
                    />
                ))}
            </Tabs>

            {loading ? (
                <LinearProgress />
            ) : (
                <Grid container spacing={2}>
                    {users.map((user, index) => (
                        <Grid item xs={12} key={user.id}>
                            <Card
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    p: 2,
                                    position: 'relative',
                                    borderLeft: `4px solid ${getRankColor(index + 1)}`
                                }}
                            >
                                <Typography
                                    variant="h4"
                                    sx={{
                                        position: 'absolute',
                                        left: -30,
                                        color: getRankColor(index + 1),
                                        fontWeight: 'bold'
                                    }}
                                >
                                    #{index + 1}
                                </Typography>

                                <Avatar
                                    src={user.avatar}
                                    sx={{ width: 60, height: 60, mr: 2 }}
                                />

                                <Box sx={{ flex: 1 }}>
                                    <Typography variant="h6">
                                        {user.name}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {user.email}
                                    </Typography>
                                    <Box sx={{ mt: 1 }}>
                                        <Chip
                                            label={`${user.completedGoals} целей выполнено`}
                                            size="small"
                                            sx={{ mr: 1 }}
                                        />
                                        <Chip
                                            label={`${user.points} очков`}
                                            size="small"
                                            color="primary"
                                        />
                                    </Box>
                                </Box>

                                <Box sx={{ textAlign: 'right', ml: 2 }}>
                                    <Typography variant="h6" color="primary">
                                        {user.points}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        очков
                                    </Typography>
                                </Box>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}
        </Box>
    );
};

export default Ranking; 