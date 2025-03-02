import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs"
import Link from "next/link";
import Image from "next/image";
import { Button } from "./ui/button";
import {LayoutDashboard } from "lucide-react";

import { checkUser } from "@/lib/checkUser";
import MyDropdown from "./MyDropdown";

const Header = async () => {
  await checkUser();
  return (
    <header className="fixed top-0 w-full border-b bg-background/80 backdrop-blur-md z-50 supports-[backdrop-filter]:bg-background/60">
        <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex flex-row gap-0">
            <Link href="/">
              <Image src='/nxt-ai-logo.png' alt='Nxt Ai logo' width={200} height={60} 
                className="h-12 py-1 w-auto object-contain"
              />
            </Link>
            
          </div>
          <div className="flex items-center space-x-2 md:space-x-4">
            <SignedIn>
              <Link href="/dashboard">
                <Button variant='outline'>
                  <LayoutDashboard className="h-4 w-4"/>
                  <span className="hidden md:block">Industry Insights</span>
                </Button>
              </Link>

              <MyDropdown/>
              
            </SignedIn>
            <SignedOut>
              
                <SignInButton > 
                  <Button variant='outline'>
                    <span>Sign in</span>
                  </Button>
                </SignInButton>
            </SignedOut>
            <SignedIn>
              <UserButton 
                appearance={{
                  elements:{
                    avatarBox:"w-10 h-10",
                    userButtonPopoverCard:'shadow-xl',
                    userPreviewMainIdentifier:'font-semibold',
                  }
                }}
                
              />
            </SignedIn>

          </div>

        </nav>
        
    </header>
  )
}

export default Header
