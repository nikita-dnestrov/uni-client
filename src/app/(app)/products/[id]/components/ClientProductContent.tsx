"use client";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../../../../../components/ui/carousel";
import { SERVER_BASE_URL } from "../../../../../lib/const";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../../../../components/ui/card";
import { Button } from "../../../../../components/ui/button";
import { ShoppingBasket } from "lucide-react";
import { cn } from "../../../../../lib/utils";
import { Separator } from "../../../../../components/ui/separator";
import { useCallback, useEffect, useState } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../../../../../components/ui/accordion";
import { Badge } from "../../../../../components/ui/badge";
import { productPageApiService } from "../api";
import { LoginStateDialog } from "./LoginStateDialog";
import { useRouter } from "next/navigation";

export const ClientProductContent = ({ product }: { product: any }) => {
  const [chosenColor, setChosenColor] = useState(product.colors[0].id);
  const [chosenSize, setChosenSize] = useState(product.colors[0].sizes[0].id);

  const [loginStateDialog, setLoginStateDialog] = useState(false);

  const router = useRouter();

  useEffect(() => {
    // console.log(product);
    console.log(chosenSize);
  }, [chosenColor]);

  const handleColorChoice = (id: string) => {
    setChosenColor(id);
    setChosenSize(product.colors.find((el: any) => el.id === id).sizes[0].id);
  };

  const handleSizeChoice = (id: string) => {
    setChosenSize(id);
  };

  const addProductToCart = useCallback(async () => {
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");

    if (userId && token) {
      await productPageApiService.addProductToCart(
        {
          userId,
          productId: product.id,
          colorId: chosenColor,
          sizeId: chosenSize,
          quantity: 1,
        },
        token
      );
      router.push("/cart");
    } else {
      setLoginStateDialog(true);
    }
  }, [chosenColor, chosenSize]);

  return (
    <>
      <div className="w-1/2  ">
        <Carousel className="w-[350px]">
          <CarouselContent>
            {product.colors
              .find((el: any) => el.id === chosenColor)
              .images.map((el: any) => {
                return (
                  <CarouselItem key={el}>
                    <img className="object-cover select-none" src={`${SERVER_BASE_URL}${el.url}`} alt="img" />
                  </CarouselItem>
                );
              })}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
      <div className="w-1/2">
        <Card className="w-full">
          <CardHeader>
            <CardDescription className="text-lg">{product.name}</CardDescription>
            <CardTitle className="text-xl">{product.category}</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-5">
            <div>
              <div className="text-sm text-gray-600">Colors</div>
              <div className="flex w-fit h-[40px] items-center rounded-xl overflow-hidden border border-slate-300">
                {product.colors.map((color: any, i: number) => (
                  <>
                    <div
                      key={color.id}
                      className={cn(
                        "flex-1 text-center py-2 font-bold text-slate-600 hover:underline cursor-pointer transition-opacity border-r border-slate-300 px-10 last:border-none",
                        chosenColor === color.id ? "underline" : "hover:underline"
                      )}
                      onClick={() => handleColorChoice(color.id)}
                    >
                      {color.color}
                    </div>
                    {product.colors.length !== i + 1 && <Separator orientation="vertical" />}
                  </>
                ))}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Size</div>
              <div className="flex w-fit h-[40px] items-center rounded-xl overflow-hidden border border-slate-300 ">
                {product.colors
                  .find((el: any) => {
                    return el.id === chosenColor;
                  })
                  .sizes.map((size: any, i: number) => (
                    <>
                      <div
                        key={size.id}
                        className={cn(
                          "flex-1 text-center py-2 font-bold text-slate-600 hover:underline cursor-pointer transition-opacity border-r border-slate-300 px-10 last:border-none",
                          chosenSize === size.id ? "underline" : "hover:underline"
                        )}
                        onClick={() => handleSizeChoice(size.id)}
                      >
                        {size.size}
                      </div>
                    </>
                  ))}
              </div>
            </div>
            <Accordion type="single" collapsible>
              <AccordionItem value="item-2">
                <AccordionTrigger>Product details</AccordionTrigger>
                <AccordionContent className="flex flex-col gap-4">
                  <div className="flex justify-between">
                    <div className="font-semibold">Material</div>
                    <div>{product.material}</div>
                  </div>
                  <div className="flex justify-between">
                    <div className="font-semibold">Gender</div>
                    <div>{product.gender}</div>
                  </div>
                  <div className="flex justify-between">
                    <div className="font-semibold">Brand</div>
                    <div>{product.brand}</div>
                  </div>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger>Description</AccordionTrigger>
                <AccordionContent>{product.description}</AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
          <CardFooter className="flex justify-between">
            <CardTitle>
              $
              {
                product.colors.find((el: any) => el.id === chosenColor).sizes.find((el: any) => el.id === chosenSize)
                  .price
              }
            </CardTitle>
            <Button onClick={addProductToCart} type="button" className="rounded">
              <ShoppingBasket size={28} />
            </Button>
          </CardFooter>
        </Card>
        <LoginStateDialog isOpen={loginStateDialog} onClose={() => setLoginStateDialog(false)} />
      </div>
    </>
  );
};
