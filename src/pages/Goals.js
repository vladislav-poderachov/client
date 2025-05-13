import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
    Grid,
    Paper,
    Typography,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Box,
    Card,
    CardContent,
    CardActions,
    IconButton,
    LinearProgress,
    Chip,
    useTheme,
    useMediaQuery
} from '@mui/material';
import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    PlayArrow as PlayIcon
} from '@mui/icons-material';
import axios from 'axios';
import YouTubePlayer from '../components/YouTubePlayer';

const Goals = () => {
    const { user } = useSelector((state) => state.auth);
    const [goals, setGoals] = useState([]);
    const [categories, setCategories] = useState([]);
    const [open, setOpen] = useState(false);
    const [currentGoal, setCurrentGoal] = useState(null);
    const [editingGoal, setEditingGoal] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        type: 'BINARY',
        categoryId: '',
        deadline: '',
        priority: 'medium',
        youtubeUrl: ''
    });
    const [loading, setLoading] = useState(true);
    const [showVideo, setShowVideo] = useState(false);
    const [selectedVideo, setSelectedVideo] = useState(null);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    useEffect(() => {
        fetchGoals();
        fetchCategories();
    }, [user.id]);

    const fetchGoals = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`/api/goals/user/${user.id}`);
            setGoals(response.data);
        } catch (error) {
            console.error('Error fetching goals:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await axios.get('/api/categories');
            setCategories(response.data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const handleOpen = (goal = null) => {
        if (goal) {
            setCurrentGoal(goal);
            setFormData({
                title: goal.title,
                description: goal.description,
                type: goal.type,
                categoryId: goal.categoryId,
                deadline: goal.deadline ? new Date(goal.deadline).toISOString().split('T')[0] : '',
                priority: goal.priority,
                youtubeUrl: goal.youtubeUrl || ''
            });
        } else {
            setCurrentGoal(null);
            setFormData({
                title: '',
                description: '',
                type: 'BINARY',
                categoryId: '',
                deadline: '',
                priority: 'medium',
                youtubeUrl: ''
            });
        }
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setEditingGoal(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingGoal) {
                await axios.put(`/api/goals/${editingGoal.id}`, formData);
            } else {
                await axios.post('/api/goals', { ...formData, userId: user.id });
            }
            fetchGoals();
            handleClose();
        } catch (error) {
            console.error('Error saving goal:', error);
        }
    };

    const handleDelete = async (goalId) => {
        if (window.confirm('Вы уверены, что хотите удалить эту цель?')) {
            try {
                await axios.delete(`/api/goals/${goalId}`);
                fetchGoals();
            } catch (error) {
                console.error('Error deleting goal:', error);
            }
        }
    };

    const handleProgressUpdate = async (goalId, progress) => {
        try {
            await axios.post(`/api/goals/${goalId}/progress`, { progress });
            fetchGoals();
        } catch (error) {
            console.error('Error updating progress:', error);
        }
    };

    const getGoalTypeLabel = (type) => {
        const types = {
            BINARY: 'Бинарная',
            TIME_BASED: 'Временная',
            HABIT: 'Привычка',
            QUANTITATIVE: 'Количественная',
        };
        return types[type] || type;
    };

    return (
        <Grid container spacing={3}>
            <Grid item xs={12}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h4">Мои цели</Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<AddIcon />}
                        onClick={() => handleOpen()}
                    >
                        Добавить цель
                    </Button>
                </Box>
            </Grid>

            {goals.map((goal) => (
                <Grid item xs={12} md={6} lg={4} key={goal.id}>
                    <Card>
                        <CardContent>
                            <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                                <Typography variant="h6" gutterBottom>
                                    {goal.title}
                                </Typography>
                                <Box>
                                    <IconButton size="small" onClick={() => handleOpen(goal)}>
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton size="small" onClick={() => handleDelete(goal.id)}>
                                        <DeleteIcon />
                                    </IconButton>
                                </Box>
                            </Box>
                            <Typography variant="body2" color="text.secondary" paragraph>
                                {goal.description}
                            </Typography>
                            <Box mb={2}>
                                <Chip
                                    label={getGoalTypeLabel(goal.type)}
                                    size="small"
                                    sx={{ mr: 1 }}
                                />
                                {goal.deadline && (
                                    <Chip
                                        label={`Дедлайн: ${new Date(goal.deadline).toLocaleDateString()}`}
                                        size="small"
                                        color="primary"
                                    />
                                )}
                            </Box>
                            <Box mb={2}>
                                <Typography variant="body2" gutterBottom>
                                    Прогресс: {goal.progress || 0}%
                                </Typography>
                                <LinearProgress
                                    variant="determinate"
                                    value={goal.progress || 0}
                                    sx={{ height: 10, borderRadius: 5 }}
                                />
                            </Box>
                        </CardContent>
                        <CardActions>
                            <Button
                                size="small"
                                onClick={() => handleProgressUpdate(goal.id, Math.min((goal.progress || 0) + 10, 100))}
                            >
                                Увеличить прогресс
                            </Button>
                        </CardActions>
                    </Card>
                </Grid>
            ))}

            <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
                <DialogTitle>
                    {editingGoal ? 'Редактировать цель' : 'Новая цель'}
                </DialogTitle>
                <form onSubmit={handleSubmit}>
                    <DialogContent>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Название"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Описание"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    multiline
                                    rows={3}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth>
                                    <InputLabel>Тип цели</InputLabel>
                                    <Select
                                        value={formData.type}
                                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                        label="Тип цели"
                                    >
                                        <MenuItem value="BINARY">Бинарная</MenuItem>
                                        <MenuItem value="TIME_BASED">Временная</MenuItem>
                                        <MenuItem value="HABIT">Привычка</MenuItem>
                                        <MenuItem value="QUANTITATIVE">Количественная</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth>
                                    <InputLabel>Категория</InputLabel>
                                    <Select
                                        value={formData.categoryId}
                                        onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                                        label="Категория"
                                    >
                                        {categories.map((category) => (
                                            <MenuItem key={category.id} value={category.id}>
                                                {category.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Дедлайн"
                                    type="date"
                                    value={formData.deadline}
                                    onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                                    InputLabelProps={{ shrink: true }}
                                />
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose}>Отмена</Button>
                        <Button type="submit" variant="contained" color="primary">
                            {editingGoal ? 'Сохранить' : 'Создать'}
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
        </Grid>
    );
};

export default Goals; 