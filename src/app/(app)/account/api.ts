import { api } from "../../../lib/utils";

type TUpdateUser = {
  name: string;
  phoneNumber: string;
};

type TUpdateAddress = {
  city: string;
  street: string;
};

const getUser = async (userId: string, token: string) =>
  (await api.get(`/user/${userId}`, { headers: { Authorization: `Bearer ${token}` } })).data;
const updateUser = async (userId: string, data: TUpdateUser, token: string) =>
  (await api.put(`/user/${userId}`, data, { headers: { Authorization: `Bearer ${token}` } })).data;
const updateUserAddress = async (userId: string, data: TUpdateAddress, token: string) =>
  (await api.put(`/user/${userId}/address`, data, { headers: { Authorization: `Bearer ${token}` } })).data;
const cancelOrder = async (orderId: string, token: string) =>
  (await api.put(`/orders/${orderId}`, { status: -1 }, { headers: { Authorization: `Bearer ${token}` } })).data;

export const userPageApiService = { getUser, cancelOrder, updateUser, updateUserAddress };
