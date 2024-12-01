import axios from "axios";
import { ClientProductContent } from "./components/ClientProductContent";

export default async function Page({ params }: { params: { id: string } }) {
  const productId = params.id;
  const getProduct = async () => {
    const response = await axios.post("http://localhost:3000/api/products", { id: productId });

    return response.data;
  };

  const product = await getProduct();

  return (
    <div className="flex gap-4 pt-[50px] px-[10vw]">
      <ClientProductContent product={product} />
    </div>
  );
}
