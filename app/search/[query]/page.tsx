'use client'

import { FunctionComponent, useEffect, useState } from "react";
import { useRouter } from 'next/navigation'
import { ProductDataWithSearch } from "@/models/interfaces";
import { collection, query, where, getDocs, getFirestore, and, or } from "firebase/firestore";


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

        const q = query(collection(db, "products"),
            or(
                // query as-is:
                and(
                    where('nameProduct', '>=', searchQuery),
                    where('nameProduct', '<=', searchQuery + '\uf8ff')
                ),
                // capitalize first letter:
                and(
                    where('nameProduct', '>=', searchQuery.charAt(0).toUpperCase() + searchQuery.slice(1)),
                    where('nameProduct', '<=', searchQuery.charAt(0).toUpperCase() + searchQuery.slice(1) + '\uf8ff')
                ),
                // lowercase:
                and(
                    where('nameProduct', '>=', searchQuery.toLowerCase()),
                    where('nameProduct', '<=', searchQuery.toLowerCase() + '\uf8ff')
                )
            )
        );


        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            console.log(doc.id, " => ", doc.data());
        });
    }


    return (<>

    </>);
}

export default SearchPage;