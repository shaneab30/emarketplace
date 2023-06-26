'use client';


import { Button, Checkbox, FormControlLabel, Grid, TextField } from "@mui/material";
import { FunctionComponent, useState } from "react";

import styles from './page.module.css'
import { firebaseApp } from "../firebase";
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { doc, getFirestore, setDoc } from "firebase/firestore";
import Link from "next/link";
import { useRouter } from "next/navigation";

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
        const userCredential = await signInWithEmailAndPassword(auth, miscdata.email, miscdata.password);
        console.log('logged in user:', userCredential.user);
        router.push('/');
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
                                <Link href = "/register"><Button >Daftar</Button></Link>
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