"use client";

import { useCallback, useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../../components/ui/card";
import { userPageApiService } from "./api";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { SubmitHandler, useForm } from "react-hook-form";
import { Switch } from "../../../components/ui/switch";
import { Button } from "../../../components/ui/button";
import { Separator } from "../../../components/ui/separator";
import dayjs from "dayjs";
import { ORDER_STATUSES } from "../../../lib/const";
import { Ban } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../../../components/ui/accordion";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "../../../components/ui/dialog";
import Link from "next/link";

type Inputs = {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  city: string;
  street: string;
};

export default function Page() {
  const [user, setUser] = useState<{ authenticated: boolean; loading: boolean; data: any }>({
    authenticated: true,
    loading: true,
    data: null,
  });

  const [isEdit, setIsEdit] = useState(false);
  const [cancelOrder, setCancelOrder] = useState(false);
  const [preCancelOrderId, setPreCancelOrderId] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<Inputs>();

  useEffect(() => {
    console.log(isEdit);
  }, [isEdit]);

  useEffect(() => {
    (async () => {
      const userId = localStorage.getItem("userId");

      if (userId) {
        const response = await userPageApiService.getUser(userId);
        setUser({ loading: false, authenticated: true, data: response });
        setValue("firstName", response.name.split(" ")[0]);
        setValue("lastName", response.name.split(" ")[1]);
        setValue("email", response.email);
        setValue("phoneNumber", response.phoneNumber);
        setValue("city", response.address.city);
        setValue("street", response.address.street);
      } else {
        setUser({ loading: false, authenticated: false, data: null });
      }
    })();
  }, []);

  const onSubmit: SubmitHandler<Inputs> = useCallback(async (data) => {
    const userId = localStorage.getItem("userId");

    if (userId) {
      await userPageApiService.updateUser(userId, {
        name: `${data.firstName} ${data.lastName}`,
        phoneNumber: data.phoneNumber,
      });

      await userPageApiService.updateUserAddress(userId, {
        city: data.city,
        street: data.street,
      });

      const response = await userPageApiService.getUser(userId);
      setUser({ loading: false, authenticated: true, data: response });
      setValue("firstName", response.name.split(" ")[0]);
      setValue("lastName", response.name.split(" ")[1]);
      setValue("email", response.email);
      setValue("phoneNumber", response.phoneNumber);
      setValue("city", response.address.city);
      setValue("street", response.address.street);
    } else {
      setUser({ loading: false, authenticated: false, data: null });
    }
    setIsEdit(false);
  }, []);

  const preHandleCancelOrder = (orderId: string) => {
    setPreCancelOrderId(orderId);
    setCancelOrder(true);
  };

  const handleCancelOrderClose = () => {
    setCancelOrder(false);
    setPreCancelOrderId("");
  };

  const handleCancelOrder = useCallback(async () => {
    const userId = localStorage.getItem("userId");

    if (userId) {
      await userPageApiService.cancelOrder(preCancelOrderId);

      const response = await userPageApiService.getUser(userId);
      setUser({ loading: false, authenticated: true, data: response });
      setValue("firstName", response.name.split(" ")[0]);
      setValue("lastName", response.name.split(" ")[1]);
      setValue("email", response.email);
      setValue("phoneNumber", response.phoneNumber);
      setValue("city", response.address.city);
      setValue("street", response.address.street);
    } else {
      setUser({ loading: false, authenticated: false, data: null });
    }
    setCancelOrder(false);
  }, [preCancelOrderId]);

  const ORDER_STATUSES_COLORS = (status: 0 | 1 | 2 | -1) => {
    switch (status) {
      case 0:
        return "text-sky-500";
      case 1:
        return "text-yellow-500";
      case 2:
        return "text-green-500";
      case -1:
        return "text-rose-500";
    }
  };

  return (
    <>
      {user.loading ? (
        <div>loading</div>
      ) : !user.authenticated ? (
        <div>You are not logged in</div>
      ) : (
        <div className="flex gap-4 px-[20vw] pt-[50px]">
          <div className="w-full">
            <Card className="w-full">
              <CardHeader>
                <CardTitle className="text-xl flex justify-between">
                  <div>Account Details</div>
                  <div className="flex items-center space-x-2">
                    <Switch checked={isEdit} onCheckedChange={() => setIsEdit((prev) => !prev)} id="editMode" />
                    <Label htmlFor="editMode">Edit</Label>
                  </div>
                </CardTitle>
                <CardDescription className="text-lg"></CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center">
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="flex gap-5 flex-wrap">
                    <div>
                      <Label htmlFor="firstName">
                        First Name {errors.firstName && <span className="text-red-500">*</span>}
                      </Label>
                      <Input disabled={!isEdit} {...register("firstName", { required: true })} />
                    </div>

                    <div>
                      <Label htmlFor="lastName">
                        Last Name {errors.lastName && <span className="text-red-500">*</span>}
                      </Label>
                      <Input disabled={!isEdit} {...register("lastName", { required: true })} />
                    </div>

                    <div>
                      <Label htmlFor="email">Email {errors.email && <span className="text-red-500">*</span>}</Label>
                      <Input disabled {...register("email", { required: true })} />
                    </div>

                    <div>
                      <Label htmlFor="phoneNumber">
                        Phone Number {errors.phoneNumber && <span className="text-red-500">*</span>}
                      </Label>
                      <Input disabled={!isEdit} {...register("phoneNumber", { required: true })} />
                    </div>

                    <div>
                      <Label htmlFor="city">City {errors.city && <span className="text-red-500">*</span>}</Label>
                      <Input disabled={!isEdit} {...register("city", { required: true })} />
                    </div>

                    <div>
                      <Label htmlFor="street">Street {errors.street && <span className="text-red-500">*</span>}</Label>
                      <Input disabled={!isEdit} {...register("street", { required: true })} />
                    </div>
                  </div>
                  {isEdit && <Button className="mt-5 rounded">Apply Changes</Button>}
                </form>

                <Separator className="my-5" />

                <div className="w-full">
                  <div className="text-xl font-bold flex mb-5">Your Orders</div>

                  {user.data.orders.length < 1 && <div>Your order list is empty</div>}
                  <div className="flex flex-col gap-5">
                    {user.data.orders.map((order: any) => {
                      return (
                        <div
                          key={order.id}
                          className="flex gap-5 justify-between items-center w-full p-4 border border-gray-200 rounded"
                        >
                          <div className="flex flex-col gap-4 flex-grow">
                            <Accordion type="single" collapsible className="w-full">
                              <AccordionItem value="item-1">
                                <AccordionTrigger>Product details</AccordionTrigger>
                                <AccordionContent>
                                  {order.orderDetails.map((el: any) => {
                                    return (
                                      <>
                                        <div>Name: {el.product.name}</div>
                                        <div>Price: $ {el.size.price}</div>
                                        <div>Amount: {el.amount}</div>

                                        <Link
                                          className="hover:underline text-blue-700"
                                          href={`/products/${el.productId}`}
                                        >
                                          Link to product
                                        </Link>
                                      </>
                                    );
                                  }, 0)}
                                </AccordionContent>
                              </AccordionItem>
                            </Accordion>
                            <div className="flex gap-4">
                              <div>{dayjs(order.date).format("DD-MM-YYYY")}</div>
                              <div>
                                Status:{" "}
                                <span className={ORDER_STATUSES_COLORS(order.status)}>
                                  {ORDER_STATUSES(order.status)}
                                </span>{" "}
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-4 items-center">
                            <div>
                              ${" "}
                              {order.orderDetails.reduce((acc: number, el: any) => {
                                return acc + el.size.price * el.amount;
                              }, 0)}
                            </div>
                            <Button
                              onClick={() => preHandleCancelOrder(order.id)}
                              className="rounded"
                              variant="destructive"
                              type="button"
                            >
                              <Ban />
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
              {/* <CardFooter className="flex justify-between"></CardFooter> */}
            </Card>
          </div>
        </div>
      )}
      <Dialog onOpenChange={handleCancelOrderClose} open={cancelOrder}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Are you sure you want to cancel this order?</DialogTitle>
          </DialogHeader>

          <DialogFooter>
            <Button className="rounded" onClick={handleCancelOrderClose} variant="destructive" type="button">
              Cancel
            </Button>
            <Button className="rounded" onClick={handleCancelOrder} type="button">
              Submit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
