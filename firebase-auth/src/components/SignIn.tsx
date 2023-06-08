import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Alert from "@mui/material/Alert";
import GoogleIcon from "@mui/icons-material/Google";
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";

import { auth, googleProvider } from "../utils/firebase";
import Copyright from "./Copyright";

type SignInData = {
    email: string,
    password: string,
};

type ErrorData = {
    code: string,
    message: string,
};

type Error = ErrorData|null;

function SignIn() {
    const navigate = useNavigate();
    const [error, setError] = useState<Error>();

    const handleGoogleSignIn = () => {
        signInWithPopup(auth, googleProvider)
            .then(result => {
                // This gives you a Google Access Token. You can use it to access the Google API.   
                const credential = GoogleAuthProvider.credentialFromResult(result);
                const token = credential?.accessToken;
                // The signed-in user info.
                const user = result.user;
                console.log("Credential:", credential);
                console.log("Token:", token);
                console.log("User:", user);
                navigate("/portal");
            })
            .catch(e => {
                const errorState = {
                    code: e.code,
                    message: e.message,
                    email: e.customData.email,
                    credential: GoogleAuthProvider.credentialFromError(e),
                };
                console.log("Error:", errorState);
                setError(errorState);
            });
    };

    const signIn = async (authData: SignInData) => {
        signInWithEmailAndPassword(auth, authData.email, authData.password)
            .then(userCredential => {
                // Signed In
                const user = userCredential.user;
                console.log("User:", user);
                navigate("/portal");
            })
            .catch(e => {
                const errorState: ErrorData = {
                    code: e.code,
                    message: e.message,
                };
                console.log("Error:", errorState);
                setError(errorState);
            });
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const authData: SignInData = {
            email: data.get("email")?.toString() ?? "",
            password: data.get("password")?.toString() ?? "",
        };
        signIn(authData);
    };

    useEffect(() => {
        if (auth.currentUser)
            navigate("/portal");
    }, []);

    return (
        <Container component="main" maxWidth="xs">
            <Box
                sx={{
                    marginTop: 8,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                }}
            >
                <Avatar
                    sx={{
                        width: "5rem",
                        height: "5rem",
                        m: 1,
                        bgcolor: "secondary.main"
                    }}
                >
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Sign In
                </Typography>
                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
                <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        name="email"
                        label="Email address"
                        type="email"
                        autoComplete="email"
                        autoFocus
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="password"
                        name="password"
                        label="Password"
                        type="password"
                        autoComplete="current-password"
                    />
                    {error && (
                        <Alert variant="outlined" severity="error">
                            {error.code} - {error.message}
                        </Alert>
                    )}
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Sign In
                    </Button>
                    <Button
                        fullWidth
                        variant="outlined"
                        sx={{ mt: 1, mb: 3 }}
                        startIcon={<GoogleIcon />}
                        onClick={handleGoogleSignIn}
                    >
                        Sign In with Google
                    </Button>
                    <Grid container>
                        <Grid item xs>
                            <Link href="#" variant="body2" onClick={() => navigate("/reset")}>
                                Forgot your password?
                            </Link>
                        </Grid>
                        <Grid item>
                            <Link href="#" variant="body2" onClick={() => navigate("/signup")}>
                                Don't have an account? Sign Up
                            </Link>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
            <Copyright sx={{ mt: 8, mb: 4 }} />
        </Container>
    );
}

export default SignIn;