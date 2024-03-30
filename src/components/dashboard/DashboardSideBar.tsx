"use client";

import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { ROUTES } from "@/constant/routeLabel";
import Image from "next/image";

const SideBar: React.FC = () => {
  const pathname = usePathname();

  return (
    <div className="space-y-4 py-4 flex flex-col h-full text-black border-none drop-shadow-xl bg-white">
      <div className="px-3 py-2 flex-1">
        <Link href="/dashboard" className="flex items-center pl-3 mb-14">
          {/* <div className="relative w-20 h-20 mr-4">
            <Image fill alt="Logo" src="/logo-nobg.png" sizes="auto"/>
          </div> */}
          <h1 className="text-lg font-bold text-black">WealthWise Hub v1.0</h1>
        </Link>
        <div className="space-y-1">
          {ROUTES.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-yellow-500 hover:bg-white/10 rounded-lg transition",
                pathname === route.href
                  ? "text-gray-800 font-bold bg-white/10"
                  : "text-gray-600"
              )}
            >
              <div className="flex items-center flex-1">
                <route.icon className={cn("h-5 w-5 mr-3", route.color)} />
                {route.label}
              </div>
            </Link>
          ))}
        </div>
        <div className="mt-60">
          <div className="mb-5">
            <Image src="/watering.gif" width={500} height={500} alt="icon" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SideBar;
