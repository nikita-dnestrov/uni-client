"use client";

import { useEffect, useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";

export const NavbarSearch = () => {
  const [input, setInput] = useState("");

  useEffect(() => {
    const searchCheck = searchParams.get("search");
    if (searchCheck != null) {
      setInput(searchCheck);
    }
  }, []);

  const router = useRouter();
  const searchParams = useSearchParams();

  const getPossibleFiltersForSearchRedirect = () => {
    const urlSearchParamObj: any = {};
    if (searchParams.get("brand")) urlSearchParamObj.brand = searchParams.get("brand");
    if (searchParams.get("category")) urlSearchParamObj.category = searchParams.get("category");
    if (searchParams.get("material")) urlSearchParamObj.material = searchParams.get("material");
    if (searchParams.get("gender")) urlSearchParamObj.gender = searchParams.get("gender");

    const urlSearchParams = new URLSearchParams(urlSearchParamObj);

    return `/products?search=${input}&${urlSearchParams.toString()}`;
  };

  return (
    <div className="flex gap-4 w-1/3">
      <Input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className=" bg-white text-black placeholder:font-normal rounded"
        placeholder="Search"
      />
      <Button
        variant="outline"
        className="text-black rounded"
        type="button"
        onClick={() => router.push(getPossibleFiltersForSearchRedirect())}
      >
        <Search />
      </Button>
    </div>
  );
};
