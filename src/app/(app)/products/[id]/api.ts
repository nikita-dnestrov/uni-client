import { api } from "../../../../lib/utils";

type TAddProduct = {
  userId: string;
  productId: string;
  colorId: string;
  sizeId: string;
  quantity: number;
};

const addProductToCart = async ({ userId, productId, colorId, sizeId, quantity }: TAddProduct) =>
  (await api.post(`/cart/`, { userId, productId, colorId, sizeId, quantity })).data;

export const productPageApiService = { addProductToCart };
