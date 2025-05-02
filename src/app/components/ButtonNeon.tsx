"use client"

import { ReactNode } from 'react'
import Link from 'next/link';

interface ButtonNeonProps {
    children: ReactNode;
    href: string;
    textColor?: string;
    neonColor?: string;
}

export default function ButtonNeon({
    children,
    href,
    textColor = "text-sky-200",
    neonColor = "shadow-[0_0_0_1px_#fff,inset_0_0_0_1px_#fff,0_0_3px_#08f,0_0_5px_#08f,0_0_10px_#08f,0_0_15px_#08f]",
  }: ButtonNeonProps) {
    return (
      <Link href={href} passHref>
        <button
          className={`
            px-4 md:px-6 py-2 min-w-[105px] md:min-w-[120px]
            bg-transparent ${textColor} text-center border border-current rounded-full text-sm
            ${neonColor}
            transition-transform hover:scale-105
            w-full max-w-xs md:max-w-none
          `}
          >
          {children}
        </button>
      </Link>
    );
  }