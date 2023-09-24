'use client';

import { FunctionComponent, useEffect, useState } from "react";
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";
import styles from './page.module.css';
import { collection, getDocs, getFirestore, query, where } from "firebase/firestore";
import { doc, getDoc } from "firebase/firestore";
import { getDownloadURL, getStorage, listAll, ref } from "firebase/storage";
import { ImageGalleryContent, ProductDataWithImage, ProductDataWithImageAndStorename, StoreData } from "@/models/interfaces";
import { Avatar, Button, Grid } from "@mui/material";
import Image from 'next/image';
import Link from 'next/link';

interface indexProps {

}

const index: FunctionComponent<indexProps> = ({ }) => {

  const [images, setimages] = useState([] as ImageGalleryContent[]);
  const [storedata, setstoredata] = useState(null as StoreData | null);
  const [products, setproducts] = useState([] as ProductDataWithImageAndStorename[]);
  const [counter, setcounter] = useState(1);

  const db = getFirestore();

  useEffect(() => {
    // getData();
    getProducts();
  }, []);



  const getProducts = async () => {

    // const q1 = query(collection(db, "users", where("storename", "==", storename )));
    // const querySnapshot1 = await getDocs(q1);
    // let ownerID = "";
    // querySnapshot1.forEach((doc) => {
    //     ownerID = doc.id;
    // })

    const q = query(collection(db, "products"));

    const loadedProducts = [] as ProductDataWithImageAndStorename[];

    const querySnapshot = await getDocs(q);
    querySnapshot.forEach(async (d) => {

      const ownerID = d.data().owner;
      console.log(d.id, ownerID);

      const docRef = doc(db, "users", ownerID);
      const docSnap = await getDoc(docRef);
      const data = docSnap.data();
      if (data) {
        const storename = data.storename;
        const storage = getStorage();
        const imageRef = ref(storage, `product/${storename}/${d.id}/0`);

        const imagePath = await getDownloadURL(imageRef);
        console.log(imagePath);

        const loadedProduct = {
          id: d.id,
          imagePath: imagePath,
          storename: storename, 
          ...d.data()
        } as ProductDataWithImageAndStorename;
        loadedProducts.push(loadedProduct);
      }


    });
    setTimeout(() => {
      setproducts(loadedProducts);
    }, 500);
    console.log(loadedProducts);

  }

  return (
    <>
      {
        products.length > 0 ?
          <div>
            <Grid container spacing={2} style={{ padding: 10 }} >
              {
                products.map((product) => {
                  return (
                    <Grid item xs={6} lg={2} key={product.id} className={styles.product}>
                      <Link href={`/store/${product.storename}/${product.id}`}>
                        <div className={styles.productBorder}>
                          <img src={product.imagePath} alt={product.nameProduct} width='100%' style={{ borderRadius: "10px 10px 0 0" }} />
                          <div className={styles.productName}>{product.nameProduct}</div>
                          <div className={styles.price}>Rp. {product.harga.replace(/\B(?=(\d{3})+(?!\d))/g, ".")}</div>
                          {/* <div className={styles.store}> {product.storename} Store</div> */}
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


    </>
  );
}


export default index;