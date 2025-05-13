import React, { useState } from 'react';
import { 
    AppBar, 
    Toolbar, 
    Typography, 
    Button, 
    IconButton, 
    Menu, 
    MenuItem, 
    Box,
    Avatar
} from '@mui/material';
import { AccountCircle, Menu as MenuIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../store/slices/authSlice';

const Header = () => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [mobileMenuAnchorEl, setMobileMenuAnchorEl] = useState(null);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);

    const handleProfileMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMobileMenuOpen = (event) => {
        setMobileMenuAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setMobileMenuAnchorEl(null);
    };

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
        handleMenuClose();
    };

    const handleProfileClick = () => {
        navigate('/profile');
        handleMenuClose();
    };

    const menuItems = [
        { text: 'Главная', path: '/' },
        { text: 'Цели', path: '/goals' },
        { text: 'Публикации', path: '/posts' },
        { text: 'Сообщения', path: '/messages' },
    ];

    const renderMenu = (
        <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
        >
            <MenuItem onClick={handleProfileClick}>Профиль</MenuItem>
            <MenuItem onClick={handleLogout}>Выйти</MenuItem>
        </Menu>
    );

    const renderMobileMenu = (
        <Menu
            anchorEl={mobileMenuAnchorEl}
            open={Boolean(mobileMenuAnchorEl)}
            onClose={handleMenuClose}
        >
            {menuItems.map((item) => (
                <MenuItem 
                    key={item.text} 
                    onClick={() => {
                        navigate(item.path);
                        handleMenuClose();
                    }}
                >
                    {item.text}
                </MenuItem>
            ))}
            {user ? (
                <>
                    <MenuItem onClick={handleProfileClick}>Профиль</MenuItem>
                    <MenuItem onClick={handleLogout}>Выйти</MenuItem>
                </>
            ) : (
                <MenuItem onClick={() => {
                    navigate('/login');
                    handleMenuClose();
                }}>
                    Войти
                </MenuItem>
            )}
        </Menu>
    );

    return (
        <AppBar position="static">
            <Toolbar>
                <IconButton
                    edge="start"
                    color="inherit"
                    aria-label="menu"
                    onClick={handleMobileMenuOpen}
                    sx={{ mr: 2, display: { sm: 'none' } }}
                >
                    <MenuIcon />
                </IconButton>

                <Typography
                    variant="h6"
                    component="div"
                    sx={{ flexGrow: 1, cursor: 'pointer' }}
                    onClick={() => navigate('/')}
                >
                    Development Goals
                </Typography>

                <Box sx={{ display: { xs: 'none', sm: 'flex' } }}>
                    {menuItems.map((item) => (
                        <Button
                            key={item.text}
                            color="inherit"
                            onClick={() => navigate(item.path)}
                        >
                            {item.text}
                        </Button>
                    ))}
                </Box>

                {user ? (
                    <IconButton
                        edge="end"
                        aria-label="account of current user"
                        aria-haspopup="true"
                        onClick={handleProfileMenuOpen}
                        color="inherit"
                    >
                        {user.avatar ? (
                            <Avatar src={user.avatar} alt={user.login} />
                        ) : (
                            <AccountCircle />
                        )}
                    </IconButton>
                ) : (
                    <Button color="inherit" onClick={() => navigate('/login')}>
                        Войти
                    </Button>
                )}
            </Toolbar>
            {renderMenu}
            {renderMobileMenu}
        </AppBar>
    );
};

export default Header; 