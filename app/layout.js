
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";



export const metadata = {
  title: "Prep AI",
  description: "Mock Interview Practice",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
    </ClerkProvider>
  );
}
