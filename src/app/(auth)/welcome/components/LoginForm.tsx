"use client";

import { SubmitHandler, useForm } from "react-hook-form";
import { Label } from "../../../../components/ui/label";
import { Input } from "../../../../components/ui/input";
import { Button } from "../../../../components/ui/button";
import { useCallback } from "react";
import { welcomePageApiService } from "../api";
import { useRouter } from "next/navigation";

type TProps = {
  onViewChange: () => void;
};

export function LoginForm({ onViewChange }: TProps) {
  type Inputs = {
    email: string;
    password: string;
  };
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = useCallback(async (data) => {
    const response = await welcomePageApiService.login(data);
    localStorage.setItem("token", response.token);
    localStorage.setItem("userId", response.userId);

    router.push("/products");
  }, []);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex gap-5 flex-col items-center">
      <div>
        <Label htmlFor="email">Email {errors.email && <span className="text-red-500">*</span>}</Label>
        <Input {...register("email", { required: true })} />
      </div>
      <div>
        <Label htmlFor="password">Password {errors.password && <span className="text-red-500">*</span>}</Label>
        <Input type="password" {...register("password", { required: true })} />
      </div>
      <Button className="w-fit" variant="default" type="submit">
        Login
      </Button>
      <Button className="w-fit" variant="link" type="button" onClick={onViewChange}>
        Dont have account?
      </Button>
    </form>
  );
}
