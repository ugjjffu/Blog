import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Derrick Linus 个人博客',
  description: '技术分享、生活随笔、工具推荐',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh">
      <body className={inter.className}>
        <div className="page-transition-wrapper">
          {children}
        </div>
      </body>
    </html>
  )
}
