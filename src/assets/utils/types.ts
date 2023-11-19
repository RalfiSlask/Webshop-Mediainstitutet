export interface ProductType {
  id: number;
  name: string;
  price: number;
  category: string;
  rating: number;
  reviews: number;
  species: string;
  image: {
    mobile: string;
    tablet: string;
    desktop: string;
  };
  alt: string;
  cart: string;
  online: number;
  shop: number;
  count: number;
};

export interface CartObjectType {
  id: number;
  name: string;
  price: number;
  cart: string;
  count: number;
  alt: string;
};
