import { api } from "../../../lib/utils";

type TUpdateUser = {
  name: string;
  phoneNumber: string;
};

type TUpdateAddress = {
  city: string;
  street: string;
};

const getUser = async (userId: string) => (await api.get(`/user/${userId}`)).data;
const updateUser = async (userId: string, data: TUpdateUser) => (await api.put(`/user/${userId}`, data)).data;
const updateUserAddress = async (userId: string, data: TUpdateAddress) =>
  (await api.put(`/user/${userId}/address`, data)).data;
const cancelOrder = async (orderId: string) => (await api.put(`/orders/${orderId}`, { status: -1 })).data;

export const userPageApiService = { getUser, cancelOrder, updateUser, updateUserAddress };
