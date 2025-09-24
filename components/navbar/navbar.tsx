import Link from 'next/link';
import React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';

const Navbar = () => {
  return (
    <nav className="flex justify-between items-center p-4 bg-gray-800 text-white">
      <h2 className="font-bold text-lg">Tasma showcase</h2>
      <div className="flex gap-4">
        <Link href="/" className="hover:underline">
          Home
        </Link>
        <Link href="/pages/table-pagination/" className="hover:underline">
          Pagination
        </Link>

        <DropdownMenu>
          <DropdownMenuTrigger>SSR</DropdownMenuTrigger>
          <DropdownMenuContent className="mr-10">
            <DropdownMenuLabel>SSR showcase</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              {' '}
              <Link href="/pages/ssr/" className="hover:underline">
                SSR
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link href="/pages/ssr-infinite/" className="hover:underline">
                SSR Infinite
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger>Suspense</DropdownMenuTrigger>
          <DropdownMenuContent className="mr-10">
            <DropdownMenuLabel>Suspense showcase</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              {' '}
              <Link href="/pages/suspense/" className="hover:underline">
                Basic query
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link
                href="/pages/suspense-infinite/"
                className="hover:underline"
              >
                Infinite query
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
};

export default Navbar;
