// frontend/src/pages/AdminUserManagement.jsx
import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, CircularProgress, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, TextField, Dialog, DialogActions, DialogContent, DialogTitle, Select, MenuItem, FormControl, InputLabel,
    // <--- CORRIGIDO AQUI: Adicionado Grid
    Grid // <-- Grid adicionado aqui
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';

import Header from '../components/Header';
import Footer from '../components/Footer';
import { useAuth } from '../hooks/useAuth';

function AdminUserManagement() {
    const { isAuthenticatedAdmin, isAuthenticated, token, logout } = useAuth();
    const navigate = useNavigate();

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [currentUser, setCurrentUser] = useState(null); // Usuário sendo editado
    const [dialogErrors, setDialogErrors] = useState({});

    // Estados do formulário de usuário (para o modal)
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [role, setRole] = useState('customer'); // Role do usuário

    useEffect(() => {
        if (!isAuthenticated) {
            alert('You need to be logged in to access this page.');
            navigate('/Login');
            return;
        }
        if (!isAuthenticatedAdmin) {
            alert('You do not have administrative access.');
            navigate('/');
            return;
        }
        fetchUsers();
    }, [isAuthenticated, isAuthenticatedAdmin, navigate, token]);

    const fetchUsers = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('http://localhost:5000/api/admin/users', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) {
                if (response.status === 401 || response.status === 403) logout();
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setUsers(data);
        } catch (err) {
            console.error("Error fetching users:", err);
            setError('Failed to load users: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenEditDialog = (user) => {
        setCurrentUser(user);
        setName(user.name);
        setEmail(user.email);
        setPhone(user.phone || '');
        setRole(user.role);
        setDialogErrors({});
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setCurrentUser(null);
        setDialogErrors({});
    };

    const validateUserForm = () => {
        let errors = {};
        if (!name) errors.name = 'Name is required.';
        if (!email) errors.email = 'Email is required.';
        else if (!/\S+@\S+\.\S+/.test(email)) errors.email = 'Email is invalid.';
        // Validação de telefone pode ser adicionada aqui se for obrigatório
        if (!role) errors.role = 'Role is required.';

        setDialogErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSaveUser = async () => {
        if (!validateUserForm()) {
            return;
        }
        setLoading(true);
        setError(null);
        try {
            const userData = { name, email, phone, role }; // Dados a serem enviados
            const response = await fetch(`http://localhost:5000/api/admin/users/${currentUser._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(userData)
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
                throw new Error(errorData.message || `Failed to update user. Status: ${response.status}`);
            }

            alert('User updated successfully!');
            handleCloseDialog();
            fetchUsers(); // Recarrega a lista
        } catch (err) {
            console.error("Error saving user:", err);
            setError('Failed to save user: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteUser = async (userId) => {
        if (!window.confirm('Are you sure you want to delete this user?')) return;
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`http://localhost:5000/api/admin/users/${userId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
                throw new Error(errorData.message || `Failed to delete user. Status: ${response.status}`);
            }
            alert('User deleted successfully!');
            fetchUsers(); // Recarrega a lista
        } catch (err) {
            console.error("Error deleting user:", err);
            setError('Failed to delete user: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading && !users.length) { // Apenas mostra loading na carga inicial
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
                <Typography variant="h6" sx={{ ml: 2 }}>Loading users...</Typography>
            </Box>
        );
    }
    if (error) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column' }}>
                <Typography color="error" variant="h6">{error}</Typography>
                <Button onClick={fetchUsers} sx={{ mt: 2 }}>Retry</Button>
            </Box>
        );
    }
    if (!isAuthenticatedAdmin) { 
        return (
            <Box sx={{ padding: '40px', maxWidth: '1200px', margin: '0 auto', minHeight: '60vh' }}>
                <Typography variant="h4" component="h1" color="error" sx={{ mb: 4 }}>Access Denied</Typography>
                <Typography variant="body1">You do not have administrative access to view this page.</Typography>
                <Button onClick={() => navigate('/')} sx={{ mt: 2 }}>Go to Home</Button>
            </Box>
        );
    }

    return (
        <>
            <Header />
            <Box sx={{ padding: '40px', maxWidth: '1200px', margin: '0 auto', minHeight: '60vh' }}>
                <Typography variant="h4" component="h1" sx={{ mb: 4, fontWeight: 'bold' }}>
                    Manage Users
                </Typography>

                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell>Name</TableCell>
                                <TableCell>Email</TableCell>
                                <TableCell>Phone</TableCell>
                                <TableCell>Role</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {users.map((user) => (
                                <TableRow key={user._id}>
                                    <TableCell>{user._id}</TableCell>
                                    <TableCell>{user.name}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>{user.phone || 'N/A'}</TableCell>
                                    <TableCell>{user.role}</TableCell>
                                    <TableCell>
                                        <IconButton onClick={() => handleOpenEditDialog(user)}>
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton onClick={() => handleDeleteUser(user._id)}>
                                            <DeleteIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="sm">
                    <DialogTitle>Edit User</DialogTitle>
                    <DialogContent>
                        {loading ? <CircularProgress sx={{ display: 'block', margin: '20px auto' }} /> : (
                            <Grid container spacing={2} sx={{ mt: 1 }}> {/* <--- AQUI ESTÁ O GRID */}
                                <Grid item xs={12}>
                                    <TextField label="Name" fullWidth value={name} onChange={(e) => setName(e.target.value)} error={!!dialogErrors.name} helperText={dialogErrors.name} />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField label="Email" fullWidth value={email} onChange={(e) => setEmail(e.target.value)} disabled />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField label="Phone" fullWidth value={phone} onChange={(e) => setPhone(e.target.value)} />
                                </Grid>
                                <Grid item xs={12}>
                                    <FormControl fullWidth>
                                        <InputLabel>Role</InputLabel>
                                        <Select value={role} label="Role" onChange={(e) => setRole(e.target.value)}>
                                            <MenuItem value="customer">Customer</MenuItem>
                                            <MenuItem value="admin">Admin</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                            </Grid>
                        )}
                    </DialogContent>
                    <DialogActions>
                        <Button 
                            onClick={handleCloseDialog} 
                            variant="outlined" // Garante que é outlined para ter borda
                            sx={{ 
                                color: '#2009EA', // Cor azul padrão
                                borderColor: '#2009EA', // Borda azul
                                '&:hover': {
                                    backgroundColor: 'rgba(32, 9, 234, 0.04)', // Levemente azul no hover
                                    borderColor: '#1a07bb', // Borda azul mais escura no hover
                                }
                            }}
                        >
                            Cancel
                        </Button>
                        <Button 
                            onClick={handleSaveUser} 
                            variant="contained" 
                            sx={{
                                backgroundColor: '#2009EA', 
                                color: '#fff',
                                '&:hover': {
                                    backgroundColor: '#1a07bb', 
                                }
                            }}
                            disabled={loading}
                        >
                            {loading ? <CircularProgress size={24} color="inherit" /> : 'Save Changes'}
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
            <Footer />
        </>
    );
}

export default AdminUserManagement;