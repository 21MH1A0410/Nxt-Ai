import { Inter} from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import Header from "@/components/header";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { Toaster } from "sonner";
const inter = Inter({subsets:["latin"]});

export const metadata = {
  title: "Nxt - Ai Carrer Coach",
  description: "",
}; 

export default function RootLayout({ children }) {
  return (
    
    <ClerkProvider 
      appearance={{
        baseTheme: dark,
      }}
      afterSignOutUrl="/onboarding"
      signInUrl="/sign-in"
      signUpUrl="/sign-up"
      afterSignInRedirectUrl='/onboarding'
      afterSignUpRedirectUrl='/onboarding'
      signInFallbackRedirectUrl="/onboarding"
      signUpFallbackRedirectUrl="/onboarding"
    >
        <html lang="en" suppressHydrationWarning>
          <head>
            <link rel="icon" href="/n-ai-logo.png" sizes="any" />
          </head>
        <body
          className={`${inter.className}` 
          
        }
        >
          <ThemeProvider
            attribute="class" defaultTheme="dark" enableSystem={true} disableTransitionOnChange={true}
          >
            {/*header*/}
            <Header/>
            <main className="min-h-screen">{children}</main>
            <Toaster richColors/>

            <footer className="bg-muted/50 py-4">
              <div className=" container mx-auto text-center py-4">
                <p>Made With love &#10084; by Rama Raju B K &copy; 2025</p>
              </div>
            </footer>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
    
  );
}
