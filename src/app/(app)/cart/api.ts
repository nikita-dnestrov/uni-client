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

const getCart = async (userId: string, token: string) =>
  (await api.get(`/cart/${userId}`, { headers: { Authorization: `Bearer ${token}` } })).data;

const addProductToCart = async ({ userId, productId, colorId, sizeId, quantity }: TAddProduct, token: string) =>
  (
    await api.post(
      `/cart/`,
      { userId, productId, colorId, sizeId, quantity },
      { headers: { Authorization: `Bearer ${token}` } }
    )
  ).data;

const removeProductFromCart = async (cartDetailId: string, userId: string, token: string) =>
  (await api.delete(`/cart/product`, { data: { cartDetailId, userId }, headers: { Authorization: `Bearer ${token}` } }))
    .data;

const clearCart = async (userId: string, token: string) =>
  (await api.delete(`/cart/clear/${userId}`, { headers: { Authorization: `Bearer ${token}` } })).data;

const createOrder = async (data: TCreateOrder, token: string) =>
  (await api.post(`/orders`, data, { headers: { Authorization: `Bearer ${token}` } })).data;

export const cartPageApiService = { getCart, addProductToCart, removeProductFromCart, clearCart, createOrder };
