import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import { Navbar } from "../../components/composite/Navbar";

const roboto = Roboto({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${roboto.className} antialiased`}>
        <Navbar />
        <div className="p-4 w-full">{children}</div>
      </body>
    </html>
  );
}
