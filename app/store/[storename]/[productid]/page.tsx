'use client';

import { FunctionComponent, useEffect, useState } from "react";
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";
import styles from './page.module.css';
import { getDownloadURL, getStorage, listAll, ref } from "firebase/storage";
import { getFirestore } from "firebase/firestore";
import { doc, getDoc } from "firebase/firestore";
import { Avatar, Button, CircularProgress, Grid, Link } from "@mui/material";
import Box from '@mui/material/Box';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { ImageGalleryContent, StoreData } from "@/models/interfaces";
import { useAppSelector } from "@/redux/hooks";

interface storeProps {
    params: any;
}

const store: FunctionComponent<storeProps> = ({ params }) => {

    const [images, setimages] = useState([] as ImageGalleryContent[]);
    const [storedata, setstoredata] = useState(null as StoreData | null);
    const [counter, setcounter] = useState(1);
    const storename = params.storename;
    const productid = params.productid;

    const db = getFirestore();


    useEffect(() => {
        getData();
    }, []);

    const getData = async () => {
        const docRef = doc(db, "products", productid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            console.log("Document data:", docSnap.data());
            setstoredata(docSnap.data() as StoreData);
        } else {
            // docSnap.data() will be undefined in this case
            console.log("No such document!");
        }

        const storage = getStorage();
        const folderRef = ref(storage, `product/${storename}/${productid}`);

        const res = await listAll(folderRef);
        const { items } = res;
        const urls = await Promise.all(
            items.map((item) => getDownloadURL(item))
        );
        const imgcontents: ImageGalleryContent[] = [];
        urls.forEach(url => {
            imgcontents.push({
                original: url,
                thumbnail: url
            });
        });
        setimages(imgcontents);

    }

    const currentUser = useAppSelector(state => state.user.currentUser);


    return (<>
        {storedata ?
            <>
                {/* <ImageGallery items={images} />
                {storename}
                {storedata.nameProduct} */}
                <Box sx={{ flexGrow: 1, align: 'center' }}>
                    <div style={{ margin: 20 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={5} style={{ padding: "20px 50px" }}>
                                <ImageGallery items={images} />
                            </Grid>
                            <Grid xs={5} style={{ padding: "30px 20px" }}>
                                {/* <p>Store: {storename}</p> */}
                                <div style={{ width: "60%" }}><h2 style={{ padding: "15px 0" }}>{storedata.nameProduct}</h2></div>
                                <div className={styles.price} style={{ padding: "15px 0" }}>Rp. {storedata.harga.replace(/\B(?=(\d{3})+(?!\d))/g, ".")}</div>
                                <div className={styles.description} style={{ textAlign: "justify", height: 500, overflow: "auto", whiteSpace: "pre-wrap" }}>{storedata.deskripsi}</div>
                            </Grid>
                            <Grid xs={2} alignContent="center" textAlign="center" style={{ paddingTop: 40 }}>
                                <div style={{ fontSize: 30, color: "#1976d2" }}>
                                    Ordering
                                </div>
                                <div className={styles.counter}>
                                    <Button onClick={() => counter > 1 && setcounter(counter - 1)}>
                                        <RemoveIcon />
                                    </Button>
                                    {counter}
                                    <Button onClick={() => setcounter(counter + 1)}>
                                        <AddIcon />
                                    </Button>
                                </div>
                                <div style={{ fontSize: 20, padding: 20, fontWeight: "bold" }}>
                                    Rp. {(parseInt(storedata.harga) * counter).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
                                </div>
                                <div>
                                    <Button className={styles.button} variant="contained">
                                        <AddShoppingCartIcon />
                                        Add to cart
                                    </Button>
                                </div>
                            </Grid>
                        </Grid>
                    </div>
                </Box>
                <div>
                    <Link href={`/store/${storename}`}>
                        <div style={{ padding: "10px 50px"}}>
                            <div style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)',  borderRadius: "10px"}}>
                                <div style={{ display: "inline-block", padding: 20 }}><Avatar alt={storename.toUpperCase()} src="/static/images/avatar/1.jpg" /></div>
                                <div style={{ display: "inline-block" }}>{storename} </div>
                            </div>
                        </div>
                    </Link>
                </div>
            </>
            :
            <div style={{ textAlign: "center", paddingTop: 80 }}>
                <CircularProgress />
            </div>
        }
    </>);
}

export default store;