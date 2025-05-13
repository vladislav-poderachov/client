import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
    Grid,
    Card,
    CardContent,
    CardActions,
    Typography,
    Button,
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Box,
    Avatar,
    IconButton,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Divider,
    Chip,
    useTheme,
    useMediaQuery,
} from '@mui/material';
import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    ThumbUp as ThumbUpIcon,
    Comment as CommentIcon,
    Send as SendIcon,
    Share as ShareIcon,
} from '@mui/icons-material';
import axios from 'axios';

const Posts = () => {
    const { user } = useSelector((state) => state.auth);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [posts, setPosts] = useState([]);
    const [open, setOpen] = useState(false);
    const [selectedPost, setSelectedPost] = useState(null);
    const [newPost, setNewPost] = useState({ title: '', content: '', category: '' });
    const [newComment, setNewComment] = useState('');
    const [openDialog, setOpenDialog] = useState(false);
    const [editingPost, setEditingPost] = useState(null);

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            const response = await axios.get('/api/publications');
            setPosts(response.data);
        } catch (error) {
            console.error('Error fetching posts:', error);
        }
    };

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setNewPost({ title: '', content: '', category: '' });
    };

    const handlePostClick = (post) => {
        setSelectedPost(post);
    };

    const handleCreatePost = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/api/publications', {
                ...newPost,
                authorId: user.id,
            });
            fetchPosts();
            handleClose();
        } catch (error) {
            console.error('Error creating post:', error);
        }
    };

    const handleAddComment = async (postId) => {
        if (!newComment.trim()) return;
        try {
            await axios.post(`/api/publications/${postId}/comments`, {
                content: newComment,
                authorId: user.id,
            });
            fetchPosts();
            setNewComment('');
        } catch (error) {
            console.error('Error adding comment:', error);
        }
    };

    const handleLike = async (postId) => {
        try {
            await axios.post(`/api/publications/${postId}/like`);
            fetchPosts();
        } catch (error) {
            console.error('Error liking post:', error);
        }
    };

    const handleOpenDialog = (post = null) => {
        if (post) {
            setEditingPost(post);
            setNewPost({
                title: post.title,
                content: post.content,
                category: post.category
            });
        } else {
            setEditingPost(null);
            setNewPost({
                title: '',
                content: '',
                category: ''
            });
        }
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setEditingPost(null);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewPost((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async () => {
        if (editingPost) {
            try {
                await axios.put(`/api/publications/${editingPost.id}`, newPost);
                fetchPosts();
                handleCloseDialog();
            } catch (error) {
                console.error('Error updating post:', error);
            }
        } else {
            try {
                await axios.post('/api/publications', {
                    ...newPost,
                    authorId: user.id,
                });
                fetchPosts();
                handleClose();
            } catch (error) {
                console.error('Error creating post:', error);
            }
        }
    };

    const handleDelete = async (postId) => {
        try {
            await axios.delete(`/api/publications/${postId}`);
            fetchPosts();
        } catch (error) {
            console.error('Error deleting post:', error);
        }
    };

    const categories = [
        'Программирование',
        'Дизайн',
        'Карьера',
        'Обучение',
        'Советы'
    ];

    return (
        <Box>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 4
                }}
            >
                <Typography variant="h4" component="h1">
                    Посты
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => handleOpenDialog()}
                >
                    Создать пост
                </Button>
            </Box>

            <Grid container spacing={3}>
                {posts.map((post) => (
                    <Grid item xs={12} key={post.id}>
                        <Card>
                            <CardContent>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'flex-start',
                                        mb: 2
                                    }}
                                >
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <Avatar
                                            src={post.author?.avatar}
                                            alt={post.author?.login}
                                            sx={{ mr: 2 }}
                                        />
                                        <Box>
                                            <Typography variant="subtitle1">
                                                {post.author?.login}
                                            </Typography>
                                            <Typography
                                                variant="body2"
                                                color="text.secondary"
                                            >
                                                {new Date(post.createdAt).toLocaleDateString()}
                                            </Typography>
                                        </Box>
                                    </Box>
                                    <Box>
                                        <IconButton
                                            size="small"
                                            onClick={() => handleOpenDialog(post)}
                                        >
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton
                                            size="small"
                                            onClick={() => handleDelete(post.id)}
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </Box>
                                </Box>

                                <Typography variant="h6" gutterBottom>
                                    {post.title}
                                </Typography>

                                <Typography
                                    variant="body1"
                                    color="text.secondary"
                                    sx={{ mb: 2 }}
                                >
                                    {post.content}
                                </Typography>

                                <Box sx={{ mb: 2 }}>
                                    <Chip label={post.category} size="small" />
                                </Box>

                                <Divider sx={{ my: 2 }} />

                                <Box
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center'
                                    }}
                                >
                                    <Box>
                                        <IconButton
                                            size="small"
                                            onClick={() => handleLike(post.id)}
                                        >
                                            <ThumbUpIcon />
                                        </IconButton>
                                        <Typography
                                            variant="body2"
                                            component="span"
                                            sx={{ ml: 1 }}
                                        >
                                            {post.likes || 0}
                                        </Typography>
                                        <IconButton size="small" sx={{ ml: 2 }}>
                                            <CommentIcon />
                                        </IconButton>
                                        <Typography
                                            variant="body2"
                                            component="span"
                                            sx={{ ml: 1 }}
                                        >
                                            {post.comments?.length || 0}
                                        </Typography>
                                    </Box>
                                    <IconButton size="small">
                                        <ShareIcon />
                                    </IconButton>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
                <DialogTitle>
                    {editingPost ? 'Редактировать пост' : 'Новый пост'}
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <TextField
                            name="title"
                            label="Заголовок"
                            value={newPost.title}
                            onChange={handleInputChange}
                            fullWidth
                            required
                        />
                        <TextField
                            name="content"
                            label="Содержание"
                            value={newPost.content}
                            onChange={handleInputChange}
                            fullWidth
                            multiline
                            rows={6}
                            required
                        />
                        <TextField
                            name="category"
                            label="Категория"
                            value={newPost.category}
                            onChange={handleInputChange}
                            fullWidth
                            select
                            SelectProps={{
                                native: true
                            }}
                        >
                            <option value="" />
                            {categories.map((category) => (
                                <option key={category} value={category}>
                                    {category}
                                </option>
                            ))}
                        </TextField>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Отмена</Button>
                    <Button
                        onClick={handleSubmit}
                        variant="contained"
                        disabled={!newPost.title || !newPost.content}
                    >
                        {editingPost ? 'Сохранить' : 'Опубликовать'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default Posts; 