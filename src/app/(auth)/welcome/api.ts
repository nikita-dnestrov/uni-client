import { api } from "../../../lib/utils";

type TRegister = {
  email: string;
  password: string;
  phoneNumber: string;
  name: string;
};

type TLogin = {
  email: string;
  password: string;
};

const login = async (data: TLogin) => (await api.post("/auth/login", data)).data;
const register = async (data: TRegister) => (await api.post("/auth/register", data)).data;

export const welcomePageApiService = { login, register };
