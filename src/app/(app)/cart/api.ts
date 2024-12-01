import { api } from "../../../lib/utils";

type TAddProduct = {
  userId: string;
  productId: string;
  colorId: string;
  sizeId: string;
  quantity: number;
};

type TCreateOrder = {
  userId: string;
  status: number;
  orderDetails: {
    productId: string;
    colorId: string;
    sizeId: string;
    amount: number;
  }[];
};

const getCart = async (userId: string) => (await api.get(`/cart/${userId}`)).data;

const addProductToCart = async ({ userId, productId, colorId, sizeId, quantity }: TAddProduct) =>
  (await api.post(`/cart/`, { userId, productId, colorId, sizeId, quantity })).data;

const removeProductFromCart = async (cartDetailId: string, userId: string) =>
  (await api.delete(`/cart/product`, { data: { cartDetailId, userId } })).data;

const clearCart = async (userId: string) => (await api.delete(`/cart/clear/${userId}`)).data;

const createOrder = async (data: TCreateOrder) => (await api.post(`/orders`, data)).data;

export const cartPageApiService = { getCart, addProductToCart, removeProductFromCart, clearCart, createOrder };
