export default function Page(props: any) {
  const test = new URLSearchParams([
    ["hi", "hello"],
    ["bruh", "heh"],
  ]);

  const string = "test=kek&next=heh";

  return <div>{new URLSearchParams(string).get("test")}</div>;
}
