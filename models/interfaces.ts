export interface ImageGalleryContent {
    original: string,
    thumbnail: string,
}

export interface StoreData {
    owner: string;
    deskripsi: string;
    harga: string;
    nameProduct: string;
}

export interface ProductDataWithImage {
    id: string;
    owner: string;
    deskripsi: string;
    harga: string;
    nameProduct: string;
    imagePath: string;
}

export interface ProductDataWithImageAndStorename {
    id: string;
    owner: string;
    deskripsi: string;
    harga: string;
    nameProduct: string;
    imagePath: string;
    storename: string;
}

export interface ProductDataWithSearch {
    id: string;
    owner: string;
    deskripsi: string;
    harga: string;
    nameProduct: string;
    imagePath: string;
    storename: string;
}