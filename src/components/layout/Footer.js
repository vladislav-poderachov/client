import React from 'react';
import { Box, Container, Typography, Link, Grid } from '@mui/material';

const Footer = () => {
    return (
        <Box
            component="footer"
            sx={{
                py: 3,
                px: 2,
                mt: 'auto',
                backgroundColor: (theme) =>
                    theme.palette.mode === 'light'
                        ? theme.palette.grey[200]
                        : theme.palette.grey[800],
            }}
        >
            <Container maxWidth="lg">
                <Grid container spacing={4}>
                    <Grid item xs={12} sm={4}>
                        <Typography variant="h6" color="text.primary" gutterBottom>
                            Development Goals
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Платформа для достижения ваших целей в развитии
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <Typography variant="h6" color="text.primary" gutterBottom>
                            Ссылки
                        </Typography>
                        <Link href="/" color="inherit" display="block">
                            Главная
                        </Link>
                        <Link href="/goals" color="inherit" display="block">
                            Цели
                        </Link>
                        <Link href="/posts" color="inherit" display="block">
                            Публикации
                        </Link>
                        <Link href="/messages" color="inherit" display="block">
                            Сообщения
                        </Link>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <Typography variant="h6" color="text.primary" gutterBottom>
                            Контакты
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Email: support@developmentgoals.com
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Телефон: +7 (999) 123-45-67
                        </Typography>
                    </Grid>
                </Grid>
                <Box mt={5}>
                    <Typography variant="body2" color="text.secondary" align="center">
                        {'© '}
                        {new Date().getFullYear()}
                        {' Development Goals. Все права защищены.'}
                    </Typography>
                </Box>
            </Container>
        </Box>
    );
};

export default Footer; 