import Link from "next/link";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { ShoppingBasket, User } from "lucide-react";
import { NavbarSearch } from "./NavbarSearch";

export function Navbar() {
  return (
    <div className="flex justify-between items-center bg-black text-white font-bold">
      <div className="flex gap-10 items-center pl-10">
        <Link href="/products">
          <div className="p-4 h-full">Logo</div>
        </Link>
        <Link href={"/products?gender=Male"}>
          <Button className="p-8 font-bold" variant="ghost">
            For Men
          </Button>
        </Link>
        <Link href={"/products?gender=Woman"}>
          <Button className="p-8 font-bold" variant="ghost">
            For Women
          </Button>
        </Link>
        <Link href={"/products?gender=Unisex"}>
          <Button className="p-8 font-bold" variant="ghost">
            Unisex
          </Button>
        </Link>
      </div>
      {/* <Input className="w-1/3 bg-white text-black placeholder:font-normal rounded" placeholder="Search" /> */}
      <NavbarSearch />
      <div className="flex gap-5 pr-10">
        <Link href="/cart">
          <ShoppingBasket />
        </Link>
        <Link href="/account">
          <User />
        </Link>
      </div>
    </div>
  );
}
