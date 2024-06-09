'use client';

import Link from 'next/link';
import { Github } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { AlignRight } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  return (
    <header className="border-[#252831] border-b sticky top-0 bg-[#0D1424] z-10">
      <nav className="flex items-center justify-between max-w-4xl mx-auto p-4 bg-[#0D1424] backdrop-blur-sm">
        <div className="w-full">
          <p className="logo font-bold text-xl bg-gradient-to-b from-purple-300 to-purple-500 bg-clip-text text-transparent">Al Quran Quiz</p>
        </div>
        <ul className="sm:flex gap-6 text-sm font-medium text-slate-400 w-full justify-center hidden">
          <li>
            <Link href={'/'} className={`${pathname === '/' || pathname === '/quiz' ? 'text-white' : ''}  transition-all duration-200`}>
              Quiz
            </Link>
          </li>
          <li>
            <Link href={'/baca-alquran'} className={`${pathname.includes('/baca-alquran') ? 'text-white' : ''}  transition-all duration-200`}>
              Baca Al-Quran
            </Link>
          </li>
          <li>
            <Link href={'/about'} className={`${pathname === '/about' ? 'text-white' : ''}  transition-all duration-200`}>
              About
            </Link>
          </li>
        </ul>
        <div className="w-full flex  items-center gap-4 justify-end">
          <Link href={'https://github.com/galuhsatria/quran-quiz'}>
            <Github />
          </Link>
          <DropdownMenu className="bg-slate-800 sm:hidden">
            <DropdownMenuTrigger asChild className="bg-[#0D1424] border-none hover:bg-slate-800 hover:text-white sm:hidden">
              <Button variant="outline" size="icon">
                <AlignRight />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-slate-900 text-slate-400 border-slate-800 sm:hidden">
              <DropdownMenuItem className="hover:bg-slate-800">
                <Link href={'/'} className={`${pathname === '/' || pathname === '/quiz' ? 'text-white' : ''} hover:text-white transition-all duration-200`}>
                  Quiz
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="hover:bg-slate-800">
                <Link href={'/baca-alquran'} className={`${pathname.includes('/baca-alquran') ? 'text-white' : ''} hover:text-white transition-all duration-200`}>
                  Baca Al-Quran
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="hover:bg-slate-800">
                <Link href={'/about'} className={`${pathname === '/about' ? 'text-white' : ''} hover:text-white transition-all duration-200`}>
                  About
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </nav>
    </header>
  );
}
