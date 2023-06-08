import { useState } from "react";
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
import { User, createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";

import { auth } from "../utils/firebase";
import Copyright from "./Copyright";

type SignUpData = {
    email: string,
    password: string,
};

type ErrorData = {
    code: string,
    message: string,
};

type Error = ErrorData|null;

function SignUp() {
    const navigate = useNavigate();
    const [error, setError] = useState<Error>();

    const sendVerification = async (user: User) => {
        await sendEmailVerification(user)
            .then(() => {
                // Email verification sent!
                console.log("Verification emil sent");
                navigate("/signin");
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

    const signUp = async (authData: SignUpData) => {
        await createUserWithEmailAndPassword(auth, authData.email, authData.password)
            .then(userCredential => {
                // Signed In
                const user = userCredential.user;
                console.log("User:", user);
                sendVerification(user);
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
        const authData: SignUpData = {
            email: data.get("email")?.toString() ?? "",
            password: data.get("password")?.toString() ?? "",
        };

        if (authData.email.length > 0 && authData.password.length > 0) 
            signUp(authData);
    };

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
                    Sign Up
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
                        Sign Up
                    </Button>
                    <Grid container justifyContent="flex-end">
                        <Grid item>
                            <Link href="#" variant="body2" onClick={() => navigate("/signin")}>
                                Do you have an account? Sign In
                            </Link>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
            <Copyright sx={{ mt: 5 }} />
        </Container>
    );
}

export default SignUp;