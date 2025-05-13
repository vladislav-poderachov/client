import React from 'react';
import { Box, Container } from '@mui/material';
import Header from './Header';
import Footer from './Footer';

const Layout = ({ children }) => {
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                minHeight: '100vh',
            }}
        >
            <Header />
            <Container
                component="main"
                maxWidth="lg"
                sx={{
                    flexGrow: 1,
                    py: 3,
                }}
            >
                {children}
            </Container>
            <Footer />
        </Box>
    );
};

export default Layout; 