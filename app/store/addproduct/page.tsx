'use client';

import { Button, TextField } from "@mui/material";
import { FunctionComponent, useEffect, useState } from "react";
import styles from './page.module.css'
import { addDoc, collection, doc, getFirestore, setDoc } from "firebase/firestore";
import { firebaseApp } from "@/app/firebase";
import { getAuth } from "firebase/auth";
interface AddProductProps {

}

const AddProduct: FunctionComponent<AddProductProps> = () => {

    const [formdata, setformdata] = useState({
        nameProduct: '',
        harga: '',
        deskripsi: '',
    });

    const submit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const localUserData = localStorage.getItem("userData");
        if (localUserData) {
            const userData: UserData = JSON.parse(localUserData);
            
            const firestore = getFirestore(firebaseApp);
            // Add a new document with a generated id.
            const docRef = await addDoc(collection(firestore, "products"), {
                ...formdata, owner: userData.uid,
            });
            console.log("Document written with ID: ", docRef.id);
        } else {
            console.log('Need to login before add product');
        }
    }

    return (
        <div style={{ padding: 20 }}>
            <div className={styles.title}>Add Produk ke Store</div>
            <form onSubmit={(e) => { submit(e); }}>
                <div className={styles.container}>
                    <TextField fullWidth name="nameProduct" label="Nama produk" variant="outlined" value={formdata.nameProduct} onChange={(e) => setformdata({ ...formdata, nameProduct: e.target.value })} />
                    <TextField fullWidth name="harga" label="Harga produk" variant="outlined" value={formdata.harga} onChange={(e) => setformdata({ ...formdata, harga: e.target.value })} />
                    <TextField fullWidth name="deskripsi" label="Deskripsi produk" variant="outlined" value={formdata.deskripsi} onChange={(e) => setformdata({ ...formdata, deskripsi: e.target.value })} />
                    <div className={styles.containerButtons}>
                        <Button variant="contained" type="submit">Submit</Button>
                    </div>
                </div>
            </form>
        </div>);
}

export default AddProduct;