"use client";

import { useCallback, useEffect, useState } from "react";
import { cartPageApiService } from "./api";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../../components/ui/card";
import { SERVER_BASE_URL } from "../../../lib/const";
import { Divide, Info, Minus, Plus, Trash } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "../../../components/ui/dialog";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../../../components/ui/accordion";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../../../components/ui/tooltip";
import Link from "next/link";

export default function CartPage() {
  const [cart, setCart] = useState<any[]>([]);
  const [address, setAddress] = useState<any>(null);
  const [loginState, setLoginState] = useState({ isLoggedIn: false, loading: true });
  const [confirmOrder, setConfirmOrder] = useState(false);

  useEffect(() => {
    (async () => {
      const checkLogin = localStorage.getItem("token");
      const checkUserId = localStorage.getItem("userId");

      if (checkLogin && checkUserId) {
        const response = await cartPageApiService.getCart(checkUserId, checkLogin);
        setCart(response.cartDetails);
        if (response.user.address) {
          setAddress(response.user.address);
        }
        setLoginState({ isLoggedIn: true, loading: false });
      } else {
        setLoginState({ isLoggedIn: false, loading: false });
      }
    })();
  }, []);

  const handleProductQuantity = useCallback(
    async (colorId: string, productId: string, sizeId: string, quantity: number) => {
      const checkUserId = localStorage.getItem("userId");
      const token = localStorage.getItem("token");

      if (checkUserId && token) {
        const response = await cartPageApiService.addProductToCart(
          {
            userId: checkUserId,
            colorId,
            productId,
            sizeId,
            quantity,
          },
          token
        );
        setCart(response.cartDetails);
      }
    },
    []
  );

  const handleProductRemove = useCallback(async (cartDetailId: string) => {
    const checkUserId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");

    if (checkUserId && token) {
      const response = await cartPageApiService.removeProductFromCart(cartDetailId, checkUserId, token);
      setCart(response.cartDetails);
    }
  }, []);

  const handleOrderCreate = useCallback(async () => {
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");

    if (userId && token) {
      await cartPageApiService.createOrder(
        {
          userId,
          status: 0,
          orderDetails: cart.map((el) => {
            return { amount: el.quantity, productId: el.productId, colorId: el.colorId, sizeId: el.sizeId };
          }),
        },
        token
      );
      await cartPageApiService.clearCart(userId, token);
      setCart([]);
      setConfirmOrder(false);
    }
  }, [cart]);

  return (
    <>
      {loginState.loading ? (
        <div>loding</div>
      ) : loginState.isLoggedIn ? (
        cart.length ? (
          <div className="flex gap-4 px-[20vw] pt-[50px]">
            <div className="w-full flex gap-5">
              <Card className="w-2/3">
                <CardHeader>
                  <CardTitle className="text-xl">Your products</CardTitle>
                  <CardDescription className="text-lg"></CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-5">
                  <div className="grid gap-5">
                    {cart.map((el) => {
                      return (
                        <div className="grid grid-cols-[100px_1fr_auto] items-center gap-10">
                          {/* Product Image and Quantity */}
                          <div className="flex flex-col items-center gap-2">
                            <img
                              className="w-[100px] h-[100px] object-cover"
                              src={`${SERVER_BASE_URL}${el.color.images[0].url}`}
                              alt="Product"
                            />
                            <div className="flex flex-col items-center">
                              <div>Quantity</div>
                              <div className="flex items-center gap-4">
                                <Button
                                  onClick={() =>
                                    handleProductQuantity(el.colorId, el.productId, el.sizeId, el.quantity - 1)
                                  }
                                  disabled={el.quantity <= 1}
                                  className="rounded"
                                  variant="ghost"
                                >
                                  <Minus />
                                </Button>
                                <div className="text-xl">{el.quantity}</div>
                                <Button
                                  onClick={() =>
                                    handleProductQuantity(el.colorId, el.productId, el.sizeId, el.quantity + 1)
                                  }
                                  className="rounded"
                                  variant="ghost"
                                >
                                  <Plus />
                                </Button>
                              </div>
                            </div>
                          </div>

                          {/* Product Details */}
                          <div className="flex flex-col gap-2 h-full ">
                            <div className="font-semibold">{el.product.name}</div>
                            <Accordion type="single" collapsible className="w-full">
                              <AccordionItem value="item-1">
                                <AccordionTrigger>Product details</AccordionTrigger>
                                <AccordionContent>
                                  <div>Price: ${el.size.price}</div>
                                  <div>Size: {el.size.size}</div>
                                  <div>Color: {el.color.color}</div>
                                  <div>Brand: {el.product.brand}</div>
                                </AccordionContent>
                              </AccordionItem>
                            </Accordion>
                          </div>

                          {/* Remove Button */}
                          <Button
                            onClick={() => handleProductRemove(el.id)}
                            className="rounded"
                            variant="outline"
                            type="button"
                          >
                            <Trash />
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
              <Card className="w-1/3">
                <CardHeader>
                  <CardTitle className="text-xl">Order details</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-5">
                  <div className="flex justify-between">
                    <div>Total price</div>
                    <div>
                      $
                      {cart.reduce((acc, el) => {
                        return acc + el.quantity * el.size.price;
                      }, 0)}
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <div>Total amount</div>
                    <div>
                      {cart.reduce((acc, el) => {
                        return acc + el.quantity;
                      }, 0)}
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <div>City</div>
                    <div>
                      {address ? (
                        address.city
                      ) : (
                        <div>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger className="underline" onClick={() => {}}>
                                <div>Empty</div>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>
                                  If the address is empty that means that you haven't specified it in your account. You
                                  can update your shipping address by clicking this
                                </p>
                                <Link className="underline" href="/account">
                                  link
                                </Link>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <div>Street</div>
                    {address ? (
                      address.street
                    ) : (
                      <div>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger className="underline" onClick={() => {}}>
                              <div>Empty</div>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>
                                If the address is empty that means that you haven't specified it in your account. You
                                can update your shipping address by clicking this
                              </p>
                              <Link className="underline" href="/account">
                                link
                              </Link>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button onClick={() => setConfirmOrder(true)} type="button" className="rounded w-full">
                    Checkout
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        ) : (
          <div className="flex gap-4 px-[500px] pt-[50px]">
            <div className="w-full">
              <Card className="w-full">
                <CardHeader>
                  {/* <CardTitle className="text-xl">Your products</CardTitle> */}
                  <CardDescription className="text-lg"></CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center">You have no items in your cart</CardContent>
                <CardFooter className="flex justify-between"></CardFooter>
              </Card>
            </div>
          </div>
        )
      ) : (
        <div className="flex gap-4 px-[500px] pt-[50px]">
          <div className="w-full">
            <Card className="w-full">
              <CardHeader>
                <CardDescription className="text-lg"></CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center">
                Please login to access your cart via this <Link href="/welcome">link</Link>
              </CardContent>
              <CardFooter className="flex justify-between"></CardFooter>
            </Card>
          </div>
        </div>
      )}
      <Dialog onOpenChange={() => setConfirmOrder((prev) => !prev)} open={confirmOrder}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Are you sure you want to create an order?</DialogTitle>
          </DialogHeader>

          <DialogFooter>
            <Button className="rounded" onClick={() => setConfirmOrder(false)} variant="destructive" type="button">
              Cancel
            </Button>
            <Button className="rounded" onClick={handleOrderCreate} type="button">
              Submit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
