'use client';


import { Button, Checkbox, FormControlLabel, Grid, TextField } from "@mui/material";
import { FunctionComponent, useState } from "react";

import styles from './page.module.css'
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import { firebaseApp } from "../firebase";


interface RegisterProps {

}

const Register: FunctionComponent<RegisterProps> = () => {

    const [formdata, setformdata] = useState({
        name: '',
        storename: '',
    });

    const [miscdata, setmiscdata] = useState({
        email: '',
        password: '',
        password2: '',
    });

    const submit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (miscdata.password === miscdata.password2) {
            // register firebase
            const auth = getAuth(firebaseApp);
            const userCredential = await createUserWithEmailAndPassword(auth, miscdata.email, miscdata.password);
            console.log('created user:', userCredential.user);
            // store data ke firestore
        } else {
            alert('Password tidak sama');
        }
    }

    return (
        <div style={{ padding: 20 }}>
            <Grid container spacing={2}>
                <Grid item xs={12} lg={6}>
                    <form onSubmit={(e) => { submit(e); }}>
                        <div className={styles.container}>
                            <div className={styles.title}>Daftar akun baru</div>
                            <TextField name="email" label="Email" fullWidth type="email" required value={miscdata.email} onChange={(e) => setmiscdata({ ...miscdata, email: e.target.value })} />
                            <TextField name="password" label="Sandi" fullWidth type="password" required value={miscdata.password} onChange={(e) => setmiscdata({ ...miscdata, password: e.target.value })} />
                            <TextField label="Ulang Sandi" fullWidth type="password" required value={miscdata.password2} onChange={(e) => setmiscdata({ ...miscdata, password2: e.target.value })} />
                            <TextField name="name" label="Nama pengguna" fullWidth required value={formdata.name} onChange={(e) => setformdata({ ...formdata, name: e.target.value })} />
                            <TextField name="storename" label="Nama toko" fullWidth required value={formdata.storename} onChange={(e) => setformdata({ ...formdata, storename: e.target.value })} />
                            <FormControlLabel required control={<Checkbox />} label="Saya setuju dengan semua aturan dari web ini." />
                            <div className={styles.containerButtons}>
                                <Button variant="contained" type="submit">Daftar</Button>
                                <Button >Login</Button>
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

export default Register;