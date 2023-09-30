'use client'

import { FunctionComponent } from "react";
import { useRouter } from 'next/navigation'



interface SearchPageProps {
    params: any;
}
 
const SearchPage: FunctionComponent<SearchPageProps> = ({params}) => {

    const query = params.query;
    const router = useRouter()
    return ( <>
        Search homepage
    </> );
}
 
export default SearchPage;