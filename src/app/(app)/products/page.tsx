import { Separator } from "../../../components/ui/separator";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../../../components/ui/accordion";
import { API_BASE_URL, BRANDS, CATEGORIES, GENDERS, MATERIALS, SERVER_BASE_URL } from "../../../lib/const";
import { ProductCard } from "../components/ProductCard";
import { Pagination, PaginationContent, PaginationItem, PaginationLink } from "../../../components/ui/pagination";
import { redirect } from "next/navigation";
import axios from "axios";
import { Checkbox } from "../../../components/ui/checkbox";
import { Label } from "../../../components/ui/label";

type TFilters = {
  material: string[];
  gender: string[];
  category: string[];
  brand: string[];
  search: string[];
};

type TProduct = {
  id: string;
  name: string;
  description: string;
  colors: { sizes: { price: number }[]; images: { url: string }[] }[];
};

type TPagination = {
  currentPage: number;
  totalPages: number;
};

async function fetchProducts(searchParams: URLSearchParams) {
  const filters: Partial<TFilters> = {
    material: searchParams.get("material") ? [searchParams.get("material")!] : [],
    gender: searchParams.get("gender") ? [searchParams.get("gender")!] : [],
    category: searchParams.get("category") ? [searchParams.get("category")!] : [],
    brand: searchParams.get("brand") ? [searchParams.get("brand")!] : [],
    search: searchParams.get("search") ? [searchParams.get("search")!] : [],
  };

  const page = parseInt(searchParams.get("page") || "1", 10);

  //@ts-ignore
  const query = new URLSearchParams({ page: page.toString(), limit: "10", ...filters });

  const response = await axios.get(`${API_BASE_URL}/products?${query.toString()}`);
  return response.data;
}

export default async function Page({
  searchParams,
}: {
  searchParams: {
    page: number | undefined;
    brand: string | undefined;
    material: string | undefined;
    category: string | undefined;
    gender: string | undefined;
    search: string | undefined;
  };
}) {
  //@ts-ignore
  const data = await fetchProducts(new URLSearchParams(searchParams));
  const products: TProduct[] = data.data;
  const pagination: TPagination = {
    currentPage: data.currentPage,
    totalPages: data.totalPages,
  };

  const filterMapper =
    (type: "material" | "gender" | "category" | "brand") => (el: { label: string; value: string }, i: number) => {
      return (
        <div key={i} className="flex gap-4 py-2 items-center">
          <PaginationLink href={linkHrefGenerator(type, el.value)}>
            <Checkbox checked={searchParams[type] === el.value ? true : false} id={`${el.label}`} />
          </PaginationLink>
          <Label htmlFor={`${el.label}`}>{el.label}</Label>
        </div>
      );
    };

  const productMapper = (el: TProduct) => {
    const { id, name, description, colors } = el;
    const price = colors[0].sizes[0].price;
    const images = colors[0].images.map((img) => `${SERVER_BASE_URL}${img.url}`);

    return <ProductCard key={id} href={`/products/${id}`} data={{ name, description, price, images }} />;
  };

  const renderPagination = () => {
    const pages = Array.from({ length: pagination.totalPages }, (_, i) => i + 1);
    return pages.map((page) => (
      <PaginationItem key={page}>
        <PaginationLink href={`?page=${page}`} className={`${pagination.currentPage === page ? "bg-slate-300" : ""}`}>
          {page}
        </PaginationLink>
      </PaginationItem>
    ));
  };

  const linkHrefGenerator = (key: string, value: string): string => {
    const searchParamsCopy = { ...searchParams, [key]: value };
    console.log(searchParamsCopy);

    //@ts-ignore
    if (key in searchParams && searchParams[key] === value) {
      //@ts-ignore
      delete searchParamsCopy[key];
    }
    console.log(searchParamsCopy);
    //@ts-ignore
    const urlQuery = new URLSearchParams(searchParamsCopy);

    return `?${urlQuery.toString()}`;
  };

  return (
    <>
      <div className="text-2xl font-bold ml-[100px] my-[15px]">Products</div>
      <div className="flex px-[100px]">
        <div className="flex w-1/6 h-screen">
          <div className="w-full">
            <Accordion defaultValue={Object.keys(searchParams)} type="multiple">
              <AccordionItem value="brand">
                <AccordionTrigger>Brand</AccordionTrigger>
                <AccordionContent>{BRANDS.map(filterMapper("brand"))}</AccordionContent>
              </AccordionItem>
              <AccordionItem value="category">
                <AccordionTrigger>Category</AccordionTrigger>
                <AccordionContent>{CATEGORIES.map(filterMapper("category"))}</AccordionContent>
              </AccordionItem>
              <AccordionItem value="material">
                <AccordionTrigger>Material</AccordionTrigger>
                <AccordionContent>{MATERIALS.map(filterMapper("material"))}</AccordionContent>
              </AccordionItem>
              <AccordionItem value="gender">
                <AccordionTrigger>Gender</AccordionTrigger>
                <AccordionContent>{GENDERS.map(filterMapper("gender"))}</AccordionContent>
              </AccordionItem>
            </Accordion>

            <Separator />
          </div>
          <Separator className="h-full ml-4" orientation="vertical" />
        </div>
        <div className="w-full px-10">
          <div className="flex flex-wrap gap-16 mb-10">{products.map(productMapper)}</div>
          <Pagination>
            <PaginationContent>{renderPagination()}</PaginationContent>
          </Pagination>
        </div>
      </div>
    </>
  );
}
