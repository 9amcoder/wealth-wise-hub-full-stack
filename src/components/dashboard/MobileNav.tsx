"use client";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { ROUTES } from "@/constant/routeLabel";

export const MobileNav = () => {
  const [state, setState] = useState(false);
  const pathname = usePathname();


  return (
    <nav className="bg-white w-full border-b md:border-0 md:mt-5 md:hidden">
      <div className="items-center px-4 max-w-screen-xl mx-auto md:flex md:px-8">
        <div className="flex items-center justify-between py-3 md:py-5 md:block">
          <div className="md:hidden">
            <Button
              className="text-gray-700 outline-none p-2 rounded-md focus:border-gray-400 focus:border"
              variant="ghost"
              onClick={() => setState(!state)}
            >
              <Menu />
            </Button>
          </div>
          <UserButton afterSignOutUrl="/" />
        </div>
        <div
          className={`flex-1 justify-self-center pb-3 mt-8 md:block md:pb-0 md:mt-0 ${
            state ? "block" : "hidden"
          }`}
        >
          <ul className="justify-center items-center space-y-1">
            {ROUTES.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                className={cn(
                  "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-yellow-500 hover:bg-white/10 rounded-lg transition",
                  pathname === route.href
                    ? "text-yellow-500 bg-black/10"
                    : "text-black"
                )}
                onClick={() => setState(false)}
              >
                <div className="flex items-center flex-1">
                  <route.icon className={cn("h-5 w-5 mr-3", route.color)} />
                  {route.label}
                </div>
              </Link>
            ))}
            {state && (
                // use this button later if needed
              <>
                {/* <div className="flex justify-end pr-5">
                <Button variant="ghost" >
                    A
                  </Button>
                </div>
                <div className="flex justify-end">
                  <Button variant="ghost" >
                    B
                  </Button>
                </div> */}
                <h1 className="text-sm text-black" >WealthWise Hub v1.0</h1>
              </>
              
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};