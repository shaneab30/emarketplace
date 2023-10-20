'use client'

import { FunctionComponent, useEffect, useState } from "react";
import { useRouter } from 'next/navigation'
import { ProductDataWithSearch } from "@/models/interfaces";
import { collection, query, where, getDocs, getFirestore, and, or, orderBy, startAt, endAt, documentId, getDoc, doc } from "firebase/firestore";
import { Grid, Link } from "@mui/material";
import styles from './page.module.css';
import { getDownloadURL, getStorage, ref } from "firebase/storage";

interface SearchPageProps {
    params: any;
}

const SearchPage: FunctionComponent<SearchPageProps> = ({ params }) => {
    const searchQuery = params.query;
    // const router = useRouter()

    const [products, setproducts] = useState([] as ProductDataWithSearch[]);
    const db = getFirestore();

    useEffect(() => {
        setTimeout(() => {
            getProducts();
        }, 300);
    }, []);

    const getProducts = async () => {

        // const q = query(collection(db, "products"));

        // const q = query(collection(db, "products"), orderBy(documentId()), startAt(searchQuery.toLowerCase()), endAt(searchQuery.toLowerCase() + '\uf8ff'));
        // const q = query(collection(db, "products"), orderBy('nameProduct'), startAt(searchQuery.toLowerCase()), endAt(searchQuery.toLowerCase() + '\uf8ff'));

        const q = query(collection(db, "products"), and(
            where(documentId(), '>=', searchQuery.toLowerCase()),
            where(documentId(), '<=', searchQuery.toLowerCase() + '\uf8ff')
        ),);
        // const q = query(collection(db, "products"),
        //     or(
        //         // query as-is:
        //         and(
        //             where('nameProduct', '>=', searchQuery),
        //             where('nameProduct', '<=', searchQuery + '\uf8ff')
        //         ),
        //         // capitalize first letter:
        //         and(
        //             where('nameProduct', '>=', searchQuery.charAt(0).toUpperCase() + searchQuery.slice(1)),
        //             where('nameProduct', '<=', searchQuery.charAt(0).toUpperCase() + searchQuery.slice(1) + '\uf8ff')
        //         ),
        //         // lowercase:
        //         and(
        //             where('nameProduct', '>=', searchQuery.toLowerCase()),
        //             where('nameProduct', '<=', searchQuery.toLowerCase() + '\uf8ff')
        //         )
        //     )
        // );

        const loadedProducts = [] as ProductDataWithSearch[];

        const querySnapshot = await getDocs(q);
        querySnapshot.forEach(async (d) => {
            console.log(d.id, " => ", d.data());


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
                } as ProductDataWithSearch;
                loadedProducts.push(loadedProduct);
            }



        });

        setTimeout(() => {
            setproducts(loadedProducts);
        }, 500);


    }


    return (<>
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
    </>);
}

export default SearchPage;