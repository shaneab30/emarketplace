'use client';


import { Alert, Button, Checkbox, FormControlLabel, Grid, Snackbar, TextField } from "@mui/material";
import { FunctionComponent, useState } from "react";
import styles from './page.module.css'
import { firebaseApp } from "../firebase";
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { doc, getFirestore, setDoc } from "firebase/firestore";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FirebaseError } from "firebase/app";

interface LoginProps {

}

const Login: FunctionComponent<LoginProps> = () => {

    const router = useRouter();


    const [miscdata, setmiscdata] = useState({
        email: '',
        password: '',
    });
    
    const submit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Login firebase
        const auth = getAuth(firebaseApp);
        // setOpen1(true);
        
        try {
            const userCredential = await signInWithEmailAndPassword(auth, miscdata.email, miscdata.password);
            // console.log(userCredential);
            // console.log('logged in user:', userCredential.user);
            setOpen1(true)
            router.push('/');
            // setOpen1(true)
        
        } catch (e) {
            console.error(e);
            if (e instanceof FirebaseError && (e.code === 'auth/wrong-password' || e.code === 'auth/user-not-found')) {
                setOpen(true); // Show error message
            
            }
        }

    }
    const [open, setOpen] = useState(false);
    const [open1, setOpen1] = useState(false);

    const handleClose = (event: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    }



    return (
        <div style={{ padding: 20 }}>
            <Grid container spacing={2}>
                <Grid item xs={12} lg={6}>
                    <form onSubmit={(e) => { submit(e); }}>
                        <div className={styles.container}>
                            <div className={styles.title}>Login</div>
                            <TextField name="email" label="Email" fullWidth type="email" required value={miscdata.email} onChange={(e) => setmiscdata({ ...miscdata, email: e.target.value })} />
                            <TextField name="password" label="Sandi" fullWidth type="password" required value={miscdata.password} onChange={(e) => setmiscdata({ ...miscdata, password: e.target.value })} />
                            <div className={styles.containerButtons}>
                                <Button variant="contained" type="submit">Login</Button>
                                <Snackbar open={open} autoHideDuration={100000} onClose={handleClose}>
                                    <Alert onClose={handleClose} severity="error" sx={{ width: '500px' }}>
                                        Wrong Email or Password!
                                    </Alert>
                                </Snackbar>

                                <Snackbar open={open1} autoHideDuration={100000} onClose={handleClose}>
                                    <Alert onClose={handleClose} severity="success" sx={{ width: '500px' }}>
                                        Success!
                                    </Alert>
                                </Snackbar>
                                <Link href="/register"><Button >Daftar</Button></Link>
                            </div>
                        </div>
                    </form>
                </Grid>
                <Grid item xs={12} lg={6} style={{ textAlign: 'center' }}>
                    <img src="https://i.imgur.com/ZQ0cdgy.jpg" alt="" style={{ width: '80%', objectFit: 'cover', padding: 10 }} />
                </Grid>
            </Grid>
        </div>
    );
}

export default Login;