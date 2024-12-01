import { ProductCard } from "./components/ProductCard";

export default function Page() {
  const data = [
    {
      name: "Nike Boots",
      price: 123,
      description: "Gello",
      images: [
        "https://cdn.sneakers123.com/release/15030807/nike-blazer-mid-victory-dr2948-100.jpg",
        "https://intertop.ua/load/CF624/1600x2133/MAIN.jpg",
      ],
    },
  ];

  return (
    <div className="p-10">
      {data.map((el) => {
        return <ProductCard data={el} />;
      })}
    </div>
  );
}
