import axios from "axios";

export async function POST(request: Request) {
  const { id } = await request.json();

  const url = `${process.env.SERVER_PUBLIC_BASE_URL}/api/products/${id}`;

  const data = await axios.get(url);

  return Response.json(data.data);
}
