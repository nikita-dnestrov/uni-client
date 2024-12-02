"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { Label } from "../../../../components/ui/label";
import { Input } from "../../../../components/ui/input";
import { Button } from "../../../../components/ui/button";
import { welcomePageApiService } from "../api";
import { useCallback } from "react";
import { useRouter } from "next/navigation";

type TProps = {
  onViewChange: () => void;
};

export function RegisterForm({ onViewChange }: TProps) {
  type Inputs = {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
  };
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = useCallback(async (data) => {
    const { firstName, lastName, ...rest } = data;
    await welcomePageApiService.register({ ...rest, name: `${firstName} ${lastName}` });
    const response = await welcomePageApiService.login(data);
    localStorage.setItem("token", response.token);
    localStorage.setItem("userId", response.userId);
    router.push("/products");
  }, []);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex gap-5 flex-col items-center">
      <div>
        <Label htmlFor="firstName">First Name {errors.firstName && <span className="text-red-500">*</span>}</Label>

        <Input {...register("firstName", { required: true })} />
      </div>
      <div>
        <Label htmlFor="lastName">Last Name {errors.lastName && <span className="text-red-500">*</span>}</Label>
        <Input {...register("lastName", { required: true })} />
      </div>
      <div>
        <Label htmlFor="email">Email {errors.email && <span className="text-red-500">*</span>}</Label>
        <Input {...register("email", { required: true })} />
      </div>
      <div>
        <Label htmlFor="phoneNumber">
          Phone Number {errors.phoneNumber && <span className="text-red-500">*</span>}
        </Label>
        <Input {...register("phoneNumber", { required: true })} />
      </div>
      <div>
        <Label htmlFor="password">Password {errors.password && <span className="text-red-500">*</span>}</Label>
        <Input type="password" {...register("password", { required: true })} />
      </div>
      <Button variant="default" type="submit">
        Register
      </Button>
      <Button variant="link" type="button" onClick={onViewChange}>
        Already have an account?
      </Button>
    </form>
  );
}
