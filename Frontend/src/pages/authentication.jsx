import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { AuthContext } from '../contexts/AuthContext';
import { Snackbar, Alert } from '@mui/material';



const defaultTheme = createTheme();

export default function Authentication() {
    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [name, setName] = React.useState('');
    const [error, setError] = React.useState('');
    const [message, setMessage] = React.useState('');
    const [formState, setFormState] = React.useState(0);
    const [open, setOpen] = React.useState(false);


    const { handleRegister, handleLogin } = React.useContext(AuthContext);

    const handleAuth = async () => {
        setError('');
        try {
            if (formState === 0) {
                await handleLogin(username, password);
            } else if (formState === 1) {
                const result = await handleRegister(name, username, password);
                console.log(result);
                setUsername('');
                setPassword('');
                setName('');
                setMessage(result);
                setOpen(true);
                setError('');
                setFormState(0);
            }
        } catch (err) {
            console.log(err);
            const errorMessage = err?.response?.data?.message || err?.message || 'An error occurred';
            setError(errorMessage);
        }
    }


    return (
        <ThemeProvider theme={defaultTheme}>
            <Grid container component="main" sx={{ height: '100vh',
                        backgroundImage: "url('https://picsum.photos/1920/1080')",
                        // backgroundColor :"red",
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        backgroundRepeat: "no-repeat",
}} justifyContent="flex-end">
                <CssBaseline />
                <Grid
                    item
                    xs={12}
                    md={7}
                    sx={{
                        height: "100vh",
                    }}
                />

                <Grid
                    item
                    xs={12}
                    md={5}
                    component={Paper}
                    elevation={6}
                    square
                    sx={{
                        height: "100vh",
                        overflowY: "auto",
                    }}
                >
                    <Box
                        sx={{
                            my: 8,
                            mx: 4,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}
                    >
                        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                            <LockOutlinedIcon />
                        </Avatar>


                        <div style={{ marginBottom: '1rem' }}>
                            <Button variant={formState === 0 ? "contained" : "text"} onClick={() => setFormState(0)}>
                                Sign In
                            </Button>
                            <Button variant={formState === 1 ? "contained" : "text"} onClick={() => setFormState(1)}>
                                Sign Up
                            </Button>
                        </div>

                        <Box component="form" onSubmit={(e) => { e.preventDefault(); handleAuth(); }} noValidate sx={{ mt: 1 }}>
                            {formState === 1 && (
                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="name"
                                    label="Full Name"
                                    name="name"
                                    value={name}
                                    autoFocus
                                    onChange={(e) => setName(e.target.value)}
                                />
                            )}

                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="username"
                                label="Username"
                                name="username"
                                value={username}
                                autoFocus={formState === 0}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                value={password}
                                type="password"
                                id="password"
                                onChange={(e) => setPassword(e.target.value)}
                            />

                            {error && <Alert severity="error" sx={{ my: 2 }}>{error}</Alert>}

                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2 }}
                            >
                                {formState === 0 ? "Login" : "Register"}
                            </Button>

                        </Box>
                    </Box>
                </Grid>
            </Grid>

            <Snackbar
                open={open}
                autoHideDuration={4000}
                onClose={() => setOpen(false)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
            >
                <Alert onClose={() => setOpen(false)} severity="success" sx={{ width: '100%' }}>
                    {message}
                </Alert>
            </Snackbar>

        </ThemeProvider>
    );
}