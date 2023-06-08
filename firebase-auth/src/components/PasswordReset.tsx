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
import { sendPasswordResetEmail } from "firebase/auth";

import { auth } from "../utils/firebase";
import Copyright from "./Copyright";

type PasswordResetData = {
    email: string,
};

type ErrorData = {
    code: string,
    message: string,
};

type Error = ErrorData|null;

function PasswordReset() {
    const navigate = useNavigate();
    const [error, setError] = useState<Error>();

    const passwordReset = (authData: PasswordResetData) => {
        sendPasswordResetEmail(auth, authData.email)
            .then(() => {
                // Password reset email sent!
                console.log("Reset email sent");
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

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const authData: PasswordResetData = {
            email: data.get("email")?.toString() ?? "",
        };
        passwordReset(authData);
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
                    Reset Password
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
                        Send reset email
                    </Button>
                    <Grid container>
                        <Grid item xs>
                            <Link href="#" variant="body2" onClick={() => navigate("/signin")}>
                                Sign In
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

export default PasswordReset;