"use client";

import axios from "axios";
import { Separator } from "../../../components/ui/separator";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../../../components/ui/accordion";
import { API_BASE_URL, BRANDS, CATEGORIES, GENDERS, MATERIALS, SERVER_BASE_URL } from "../../../lib/const";
import { Checkbox } from "../../../components/ui/checkbox";
import { Label } from "../../../components/ui/label";
import { ProductCard } from "../components/ProductCard";
import { TProduct } from "../../../types/Product";
import { useCallback, useEffect, useState } from "react";
import { Pagination, PaginationContent, PaginationItem, PaginationLink } from "../../../components/ui/pagination";
import { useRouter } from "next/navigation";

type TFilters = {
  material: string[];
  gender: string[];
  category: string[];
  brand: string[];
};

type TPagination = {
  currentPage: number;
  totalPages: number;
};

export default function Page() {
  const [filters, setFilters] = useState<TFilters>({ material: [], gender: [], category: [], brand: [] });
  const [pagination, setPagination] = useState<TPagination>({
    currentPage: 1,
    totalPages: 1,
  });
  const [data, setData] = useState<TProduct[]>([]);

  const router = useRouter();

  useEffect(() => {
    (async () => {
      const baseParams = { page: 1, limit: 10, sort: "name", order: "desc" };

      const queryString =
        "?" +
        Object.entries(baseParams)
          .map(([key, value]: any) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
          .join("&");

      const response = await axios.get(`${API_BASE_URL}/products${queryString}`);
      setData(response.data.data);
      setPagination((prev) => {
        return { ...prev, totalPages: response.data.totalPages };
      });
    })();
  }, []);

  const fetchNewProducts = useCallback(async () => {
    const baseParams: any = {};

    for (const key in filters) {
      const theKey = key as keyof TFilters;

      if (filters[theKey].length) {
        baseParams[theKey] = filters[theKey][0];
      }
    }

    baseParams.page = pagination.currentPage;
    baseParams.limit = 10;

    const queryString =
      "?" +
      Object.entries(baseParams)
        .map(([key, value]: any) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
        .join("&");

    const response = await axios.get(`${API_BASE_URL}/products${queryString}`);

    setData(response.data.data);
  }, [filters, pagination]);

  const filterMapper = (el: { label: string; value: string }, i: number) => {
    return (
      <div key={i} className="flex gap-4 py-2">
        <Checkbox id={`${el.label}`} />
        <Label htmlFor={`${el.label}`}>{el.label}</Label>
      </div>
    );
  };

  const productMapper = (el: TProduct) => {
    const { name, description, colors, id } = el;

    const price = colors[0].sizes[0].price;
    const images = colors[0].images.map((el) => `${SERVER_BASE_URL}${el.url}`);

    const finalProduct = { id, name, description, price, images };

    // return <ProductCard key={el.id} data={finalProduct} onButtonClick={() => router.push(`/products/${el.id}`)} />;
    return <div></div>;
  };

  const renderPagiantionItems = () => {
    const array = Array.from({ length: pagination.totalPages }, (_, i) => i + 1);
    return array.map((el) => (
      <PaginationItem>
        <PaginationLink
          className={`${
            pagination.currentPage === el ? "bg-slate-300 hover:bg-slate-300 cursor-default" : "cursor-pointer"
          } rounded`}
          onClick={async () => {
            if (pagination.currentPage !== el) {
              setPagination((prev) => ({ ...prev, currentPage: el }));
              await fetchNewProducts();
            }
          }}
        >
          {el}
        </PaginationLink>
      </PaginationItem>
    ));
  };

  return (
    <>
      <div className="text-2xl font-bold ml-[100px] my-[15px] ">Products</div>
      <div className="flex px-[100px]">
        <div className="flex w-1/6 h-screen">
          <div className="w-full">
            <Accordion type="single" collapsible>
              <AccordionItem value="item-1">
                <AccordionTrigger>Brand</AccordionTrigger>
                <AccordionContent>{BRANDS.map(filterMapper)}</AccordionContent>
              </AccordionItem>
            </Accordion>
            <Separator />
            <Accordion type="single" collapsible>
              <AccordionItem value="item-1">
                <AccordionTrigger>Material</AccordionTrigger>
                <AccordionContent>{MATERIALS.map(filterMapper)}</AccordionContent>
              </AccordionItem>
            </Accordion>
            <Separator />
            <Accordion type="single" collapsible>
              <AccordionItem value="item-1">
                <AccordionTrigger>Gender</AccordionTrigger>
                <AccordionContent>{GENDERS.map(filterMapper)}</AccordionContent>
              </AccordionItem>
            </Accordion>
            <Separator />
            <Accordion type="single" collapsible>
              <AccordionItem value="item-1">
                <AccordionTrigger>Category</AccordionTrigger>
                <AccordionContent>{CATEGORIES.map(filterMapper)}</AccordionContent>
              </AccordionItem>
            </Accordion>
            <Separator />
          </div>
          <Separator className="h-full ml-4" orientation="vertical" />
        </div>
        <div className="w-full p-10">
          <div className="flex flex-wrap gap-16 mb-10">{data.map(productMapper)}</div>
          <Pagination>
            <PaginationContent>{renderPagiantionItems()}</PaginationContent>
          </Pagination>
        </div>
      </div>
    </>
  );
}
