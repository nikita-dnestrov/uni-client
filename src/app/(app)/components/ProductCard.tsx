import Image from "next/image";
import { Button } from "../../../components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../../components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../../../components/ui/carousel";
import { TProduct } from "../../../types/Product";
import { ShoppingBasket } from "lucide-react";
import Link from "next/link";

export const ProductCard = ({
  data,
  href,
}: {
  data: { name: string; description: string; images: string[]; price: number };
  href: string;
}) => {
  return (
    <Card className="w-fit">
      <CardHeader>
        <CardTitle>{data.name}</CardTitle>
        <CardDescription>{data.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex items-center justify-center">
        <Carousel className=" ">
          <CarouselContent className="w-[350px] h-[350px]">
            {data.images.map((el) => {
              return (
                <CarouselItem key={el}>
                  <img className="object-cover" src={el} alt="img" />
                </CarouselItem>
              );
            })}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </CardContent>
      <CardFooter className="flex justify-between">
        <CardTitle>${data.price}</CardTitle>
        <Link href={href}>
          <Button type="button" className="rounded">
            <ShoppingBasket size={28} />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};
