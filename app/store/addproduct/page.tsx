'use client';

import { NumberFormatValues, NumericFormat, NumericFormatProps } from 'react-number-format';
import { Alert, Button, IconButton, Snackbar, TextField } from "@mui/material";
import { FunctionComponent, useCallback, useEffect, useRef, useState } from "react";
import styles from './page.module.css'
import { addDoc, collection, doc, getFirestore, setDoc } from "firebase/firestore";
import { firebaseApp } from "@/app/firebase";
import { getAuth } from "firebase/auth";
import { useAppSelector } from "@/redux/hooks";
import { getStorage, ref, uploadBytes } from "firebase/storage";
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import CloseIcon from '@mui/icons-material/Close';
import React from 'react';
interface AddProductProps {

}

const AddProduct: FunctionComponent<AddProductProps> = () => {

    const currentUser = useAppSelector(state => state.user.currentUser);

    const [formdata, setformdata] = useState({
        nameProduct: '',
        harga: '',
        deskripsi: '',
        owner: '',
    });

    const [images, setimages] = useState<File[]>([]);

    const storage = getStorage();

    const submit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (currentUser) {
            const firestore = getFirestore(firebaseApp);
            // Add a new document with a generated id.
            // const docRef = await addDoc(collection(firestore, "products"), {
            //     ...formdata, owner: currentUser.uid,
            // });
            const title = formdata.nameProduct.toLowerCase().replace(/[^a-zA-Z0-9]/g, '-').substring(0, 40);
            const docRef = await setDoc(doc(firestore, "products", title), {
                ...formdata, owner: currentUser.uid,
            });
            // console.log("Document written with ID: ", docRef.id);
            let imageNumber = 0;
            images!.forEach(async image => {
                const storageRef = ref(storage, `product/${currentUser.storename}/${title}/${imageNumber}`);

                imageNumber++;

                const snapshot = await uploadBytes(storageRef, image);

                console.log('Uploaded a blob or file!')
            });
        } else {
            console.log('Need to login before add product');
        }
    }

    const handleFileSelector = (files: FileList | null) => {
        if (files && files.length > 0 && files.length < 6) {
            setimages(Array.from(files));
        } else {
            alert('Max 5 images');
        }
    }

    interface CustomProps {
        onChange: (event: { target: { name: string; value: string } }) => void;
        name: string;
    }

    // const NumericFormatCustom = React.forwardRef<NumericFormatProps, CustomProps>(
    //     function NumericFormatCustom(props, ref) {
    //         const { onChange, ...other } = props;

    //         console.log('NumericFormatCustom rendered');

    //         return (
    //             <NumericFormat
    //                 {...other}
    //                 getInputRef={ref}
    //                 onValueChange={(values) => {
    //                     console.log('onValueChange triggered');
    //                     setformdata({ ...formdata, harga: values.value });
    //                 }}
    //                 thousandSeparator
    //                 valueIsNumericString
    //                 prefix="Rp. "
    //             />
    //         );
    //     }
    // );

        const [open, setOpen] = React.useState(false);

        const handleClick = () => {
            setOpen(true);
        };

        const handleClose = (event: React.SyntheticEvent | Event, reason?: string) => {
            if (reason === 'clickaway') {
                return;
            }

            setOpen(false);
        };

        return (
            <div style={{ padding: 20 }}>
                <div className={styles.title}>Add Produk ke Store</div>
                <form onSubmit={(e) => { submit(e); }}>
                    <div className={styles.container}>
                        <TextField fullWidth name="nameProduct" label="Nama produk" variant="outlined" value={formdata.nameProduct} onChange={(e) => setformdata({ ...formdata, nameProduct: e.target.value })} />
                        <TextField
                            label="Harga Produk"
                            value={formdata.harga}
                            onChange={(e) => setformdata({ ...formdata, harga: e.target.value })}
                            name="numberformat"
                            id="formatted-numberformat-input"
                            // InputProps={{
                            //     inputComponent: NumericFormatCustom as any,
                            // }}
                            variant="outlined"
                        />
                        {/* <TextField fullWidth name="harga" type="number" label="Harga produk" variant="outlined" value={formdata.harga} onChange={(e) => setformdata({ ...formdata, harga: e.target.value })} /> */}
                        <TextField multiline rows={4} fullWidth name="deskripsi" label="Deskripsi produk" variant="outlined" value={formdata.deskripsi} onChange={(e) => setformdata({ ...formdata, deskripsi: e.target.value })} />
                        <input type="file" accept="image/*" multiple onChange={(e) => { handleFileSelector(e.target.files) }} />
                        <div>
                            {images && images.length > 0 && images.map((image) => (
                                <img src={URL.createObjectURL(image)} key={image.name} style={{ width: 100, height: 100, objectFit: 'cover', display: 'inline-block', marginRight: 10 }} />
                            ))}
                        </div>

                        <div className={styles.containerButtons}>
                            <Button variant="contained" type="submit" onClick= {handleClick}>Submit</Button>
                            <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
                                <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
                                    Success!
                                </Alert>
                            </Snackbar>
                        </div>
                    </div>
                </form>
            </div>);
    }

    export default AddProduct;