'use client';

import { FunctionComponent, useEffect, useState } from "react";
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";
import styles from './page.module.css';
import { collection, getDocs, getFirestore, query, where } from "firebase/firestore";
import { doc, getDoc } from "firebase/firestore";
import { getDownloadURL, getStorage, listAll, ref } from "firebase/storage";
import { ImageGalleryContent, ProductDataWithImage, StoreData } from "@/models/interfaces";
import { Avatar, Button, Grid } from "@mui/material";
import Image from 'next/image';
import Link from 'next/link';

interface storeProps {
    params: any;
}

const store: FunctionComponent<storeProps> = ({ params }) => {

    const [images, setimages] = useState([] as ImageGalleryContent[]);
    const [storedata, setstoredata] = useState(null as StoreData | null);
    const [products, setproducts] = useState([] as ProductDataWithImage[]);
    const [counter, setcounter] = useState(1);
    const storename = params.storename;

    const db = getFirestore();

    useEffect(() => {
        // getData();
        getProducts();
    }, []);

    const getProducts = async () => {

        const q1 = query(collection(db, "users"), where("storename", "==", storename));
        const querySnapshot1 = await getDocs(q1);
        let ownerID = "";
        querySnapshot1.forEach((doc) => {
            ownerID = doc.id;
        })

        const q = query(collection(db, "products"), where("owner", "==", ownerID));

        const loadedProducts = [] as ProductDataWithImage[];

        const querySnapshot = await getDocs(q);
        querySnapshot.forEach(async (doc) => {

            const storage = getStorage();
            const imageRef = ref(storage, `product/${storename}/${doc.id}/0`);

            const imagePath = await getDownloadURL(imageRef);
            console.log(imagePath);

            const loadedProduct = {
                id: doc.id,
                imagePath: imagePath,
                ...doc.data()
            } as ProductDataWithImage;
            loadedProducts.push(loadedProduct);
        });
        setTimeout(() => {
            setproducts(loadedProducts);
        }, 500);
        console.log(loadedProducts);

    }

    // const getData = async () => {
    //     const docRef = doc(db, "products", productid);
    //     const docSnap = await getDoc(docRef);

    //     if (docSnap.exists()) {
    //         console.log("Document data:", docSnap.data());
    //         setstoredata(docSnap.data() as StoreData);
    //     } else {
    //         // docSnap.data() will be undefined in this case
    //         console.log("No such document!");
    //     }

    //     const storage = getStorage();
    //     const folderRef = ref(storage, `product/${storename}/${productid}`);

    //     const res = await listAll(folderRef);
    //     const { items } = res;
    //     const urls = await Promise.all(
    //         items.map((item) => getDownloadURL(item))
    //     );
    //     const imgcontents: ImageGalleryContent[] = [];
    //     urls.forEach(url => {
    //         imgcontents.push({
    //             original: url,
    //             thumbnail: url
    //         });
    //     });
    //     setimages(imgcontents);

    // }

    return (<>
        <div>
            <Link href={`/store/${storename}`}>
                <div style={{ padding: "10px 10px" }}>
                    <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.5)', border: '0.5px solid', borderColor: 'rgba(0, 0, 0, 0.2)', borderRadius: "10px" }}>
                        <Grid container>
                            <Grid item xs={2}>
                                <div style={{ display: "inline-block", padding: 20 }}><Avatar sx={{ width: 100, height: 100 }} alt={storename.toUpperCase()} src="/static/images/avatar/1.jpg" /></div>
                            </Grid>
                            <Grid item xs={10} style={{ padding: 20 }}>
                                <div style={{ display: "inline-block", fontSize: 20, fontWeight: 'bold' }}>{storename} </div>
                                <br />
                                <div style={{ display: "inline-block" }}>Store Page</div>
                            </Grid>
                        </Grid>

                    </div>
                </div>
            </Link>
        </div>
        {
            products.length > 0 ?
                <div>
                    <Grid container spacing={2} style={{ padding: 10 }} >
                        {
                            products.map((product) => {
                                return (
                                    <Grid item xs={6} lg={2} key={product.id} className={styles.product}>
                                        <Link href={`/store/${storename}/${product.id}`}>
                                            <div className={styles.productBorder}>
                                                <img src={product.imagePath} alt={product.nameProduct} width='100%' style={{ borderRadius: "10px 10px 0 0" }} />
                                                <div className={styles.productName}>{product.nameProduct}</div>
                                                <div className={styles.price}>Rp. {product.harga.replace(/\B(?=(\d{3})+(?!\d))/g, ".")}</div>
                                            </div>
                                        </Link>
                                    </Grid>
                                )
                            })
                        }
                    </Grid>
                </div>
                :
                <div>Loading</div>
        }
    </>);
}

export default store;