import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import jukeboxLogo from "../assets/jukebox-logo.png";

// Importações do Material-UI
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    IconButton,
    Drawer,
    List,
    ListItem,
    ListItemText,
    Box,
} from '@mui/material';

// Ícones do Material-UI
import MenuIcon from '@mui/icons-material/Menu'; // Ícone de menu (hamburguer)
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'; // Coração para Favoritos
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined'; // Carrinho de compras
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined'; // Ícone de usuário/conta

import "../css/header.css"; // Mantenha seu CSS personalizado, se necessário
import "../css/main.css";

function Header() {
    const { user, isAuthenticated } = useAuth();
    const [drawerOpen, setDrawerOpen] = useState(false); // Estado para controlar a abertura do Drawer

    const handleDrawerToggle = () => {
        setDrawerOpen(!drawerOpen);
    };

    // Itens de navegação para o menu (reutilizáveis para desktop e mobile)
    const navItems = [
        { name: "Home", path: "/" },
        { name: "CD", path: "/CD" },
        { name: "Vinyl", path: "/Vinyl" },
        { name: "Accessories", path: "/Accessories" },
        { name: "Genres", path: "/Genres" },
        { name: "About", path: "/About" },
    ];

    // Conteúdo do Drawer (menu lateral para mobile)
    const drawer = (
        <Box
            onClick={handleDrawerToggle} // Fecha o drawer ao clicar em um item
            sx={{ width: 250 }}
            role="presentation"
        >
            <List>
                {navItems.map((item) => (
                    <ListItem button key={item.name} component={RouterLink} to={item.path}>
                        <ListItemText primary={item.name} />
                    </ListItem>
                ))}
                {/* Links de conta no menu lateral para mobile */}
                <ListItem button component={RouterLink} to="/Favorites">
                    <ListItemText primary="Favorites" />
                </ListItem>
                <ListItem button component={RouterLink} to="/Cart">
                    <ListItemText primary="Cart" />
                </ListItem>
                {isAuthenticated ? (
                    <ListItem button component={RouterLink} to="/my-account">
                        <ListItemText primary="My Account" />
                    </ListItem>
                ) : (
                    <ListItem button component={RouterLink} to="/Login">
                        <ListItemText primary="Login" />
                    </ListItem>
                )}
            </List>
        </Box>
    );

    return (
        <>
            {/* Notificação no topo */}
            <Box className="top-notification">
                We guarantee you'll be delighted with your purchase and its condition.
            </Box>

            <AppBar position="static" sx={{ backgroundColor: 'white', borderBottom: '1px solid #ddd', boxShadow: 'none', padding: { xs: '10px 20px', md: '10px 160px' } }}>
                <Toolbar disableGutters sx={{ justifyContent: 'space-between' }}>
                    {/* Botão de Menu (Hamburguer) - Visível apenas em telas pequenas (xs, sm) */}
                    <Box sx={{ display: { xs: 'block', md: 'none' } }}> {/* Usando Box com display para responsividade */}
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            edge="start"
                            onClick={handleDrawerToggle}
                            sx={{ color: 'black' }}
                        >
                            <MenuIcon />
                        </IconButton>
                    </Box>

                    {/* Logo */}
                    <Box sx={{ flexGrow: 0, display: 'flex', alignItems: 'center' }}>
                        <RouterLink to="/">
                            <img src={jukeboxLogo} alt="Jukebox Logo" style={{ height: '20px', width: 'auto' }} />
                        </RouterLink>
                    </Box>

                    {/* Navegação Principal - Visível apenas em telas médias e grandes (md e up) */}
                    <Box sx={{ display: { xs: 'none', md: 'flex' }, flexGrow: 1, justifyContent: 'center' }}> {/* Usando Box com display para responsividade */}
                        {navItems.map((item) => (
                            <Button
                                key={item.name}
                                component={RouterLink}
                                to={item.path}
                                sx={{
                                    my: 2, // Margem vertical (top/bottom)
                                    color: 'black',
                                    display: 'block', // Garante que o botão ocupe a largura completa do item se necessário
                                    textTransform: 'none', // Mantém o texto como está (sem maiúsculas automáticas)
                                    fontSize: '16px',
                                    margin: '0 7px', // Margem horizontal (left/right)
                                    '&:hover': {
                                        color: '#2009ea',
                                        textDecoration: 'underline'
                                    },
                                    display: 'flex',       // Trata o botão como um container flex
                                    alignItems: 'center',  // Centraliza o conteúdo verticalmente
                                    justifyContent: 'center', // Centraliza o conteúdo horizontalmente
                                    padding: '6px 12px', // Um padding razoável, se precisar ajustar o "tamanho da caixa"
                                }}
                            >
                                {item.name}
                            </Button>
                        ))}
                    </Box>

                    {/* Ícones de Ação (Favorites, Cart, User) - Visíveis em todas as telas */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <IconButton component={RouterLink} to="/Favorites" sx={{ color: 'black' }}>
                            <FavoriteBorderIcon />
                        </IconButton>
                        <IconButton component={RouterLink} to="/Cart" sx={{ color: 'black' }}>
                            <ShoppingCartOutlinedIcon />
                        </IconButton>
                        {isAuthenticated ? (
                            <IconButton component={RouterLink} to="/my-account" sx={{ color: 'black' }}>
                                <AccountCircleOutlinedIcon />
                            </IconButton>
                        ) : (
                            <IconButton component={RouterLink} to="/Login" sx={{ color: 'black' }}>
                                <AccountCircleOutlinedIcon />
                            </IconButton>
                        )}
                    </Box>
                </Toolbar>
            </AppBar>

            {/* Drawer para Mobile */}
            <Drawer
                anchor="left" 
                open={drawerOpen}
                onClose={handleDrawerToggle}
            >
                {drawer}
            </Drawer>
        </>
    );
}

export default Header;