import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../styles/globals.css";
import { Container } from "@mui/material";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Basis Theory 3DS Web Tester",
  description: "Example app to test Basis Theory 3DS Web",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </head>
      <body className={inter.className}>
        <Container
          maxWidth="sm"
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100vh",
          }}
        >
          {children}
        </Container>
      </body>
    </html>
  );
}
