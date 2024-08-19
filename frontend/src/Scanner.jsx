import React from "react";
import { Inter } from "next/font/google";
import "./globals.css";
import Scanner from "./S2.jsx"; // You're importing Scanner from S2.jsx, which seems circular

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <App /> {/* Assuming you have App component somewhere else */}
      </body>
    </html>
  );
}
