import Link from 'next/link';
import Image from 'next/image';

export default function Navbar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between py-4 px-6 bg-white border-b border-gray-100 shadow-sm">
      <div className="flex items-center">
        <Link href="/" className="mr-6" prefetch={true}>
          {/* 请保存Zed logo到public/logo.svg */}
          <Image src="/logo.svg" alt="Zed Logo" width={24} height={24} priority />
        </Link>
        <nav className="hidden md:flex space-x-6">
          <Link href="/releases" className="text-gray-600 hover:text-gray-900" prefetch={true}>Releases</Link>
          <Link href="/extensions" className="text-gray-600 hover:text-gray-900" prefetch={true}>Extensions</Link>
          <Link href="/docs" className="text-gray-600 hover:text-gray-900" prefetch={true}>Docs</Link>
          <Link href="/blog" className="text-gray-600 hover:text-gray-900" prefetch={true}>Blog</Link>
          <div className="relative group">
            <button className="flex items-center text-gray-600 hover:text-gray-900">
              Resources
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        </nav>
      </div>
      <div className="flex items-center space-x-4">
        <div className="hidden md:flex items-center border rounded-full px-3 py-1 bg-gray-50">
          <span className="text-xs text-gray-500 mr-1">Ctrl + Shift + P</span>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <Link href="/contact" className="text-gray-600 hover:text-gray-900 text-sm" prefetch={true}>
          Talk to us
        </Link>
        <Link href="/download" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded text-sm flex items-center" prefetch={true}>
          Download
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </Link>
      </div>
    </header>
  );
}