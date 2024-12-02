import axios from "axios";
import { ClientProductContent } from "./components/ClientProductContent";

export default async function Page({ params }: { params: { id: string } }) {
  const productId = params.id;
  const getProduct = async () => {
    const response = await axios.get(`http://34.75.95.89:5000/api/products/${productId}`);

    return response.data;
  };

  const product = await getProduct();

  return (
    <div className="flex gap-4 pt-[50px] px-[10vw]">
      <ClientProductContent product={product} />
    </div>
  );
}
