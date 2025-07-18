'use client';

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { User } from "next-auth";
import { Button } from "./ui/button";

const Navbar = () => {
  const { data: session } = useSession();
  const user: User = session?.user as User;

  return (
    <nav className="w-full bg-white shadow-md border-b border-gray-200 py-4">
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-blue-600 tracking-tight mb-3 md:mb-0">
          Confess<span className="text-gray-800">It</span>
        </Link>

        <div className="flex items-center space-x-4 text-sm md:text-base">
          {session ? (
            <>
              <span className="text-gray-600">
                Welcome,&nbsp;
                <span className="font-medium text-gray-800">
                  {user?.username || user?.email}
                </span>
              </span>
              <Button
                className="bg-red-500 hover:bg-red-600 text-white transition-all"
                onClick={() => signOut()}
              >
                Logout
              </Button>
            </>
          ) : (
            <Link href="/sign-in">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white transition-all">
                Login
              </Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
