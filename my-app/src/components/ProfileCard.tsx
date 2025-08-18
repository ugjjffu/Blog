"use client";

import Image from 'next/image';
import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';

export default function ProfileCard() {
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [isEmailHovered, setIsEmailHovered] = useState(false);
  const emailRef = useRef<HTMLDivElement>(null);
  
  // 点击外部关闭弹出框
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (emailRef.current && !emailRef.current.contains(event.target as Node) && showEmailModal) {
        setShowEmailModal(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showEmailModal]);
  
  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg shadow-lg p-6 mb-8 border border-gray-200 hover:shadow-xl transition-shadow duration-300">
      <div className="flex flex-col items-center text-center">
        {/* 头像占位符 - 请将图片保存在 public/images/avatar.jpg */}
        <div className="relative w-32 h-32 mb-4 rounded-full overflow-hidden shadow-md transform hover:scale-105 transition-transform duration-300">
          <Image 
            src="/images/avatar.jpg" 
            alt="个人头像" 
            fill 
            className="object-cover"
            priority
          />
        </div>
        
        <h2 className="text-xl font-bold text-gray-800 mb-3 hover:text-blue-600 transition-colors duration-300">头像是本人</h2>
        
        <div className="bg-white px-4 py-3 rounded-lg shadow-sm border border-gray-100 w-full mb-4 hover:border-blue-200 transition-colors duration-300">
          <div className="flex items-center mb-2">
            <div className="bg-blue-100 p-1.5 rounded-full mr-3">
              <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"></path>
              </svg>
            </div>
            <p className="text-gray-700 font-medium">北京朝阳海底捞大学</p>
          </div>
          
          <div className="flex items-center mb-2">
            <div className="bg-green-100 p-1.5 rounded-full mr-3">
              <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd"></path>
              </svg>
            </div>
            <p className="text-gray-700 font-medium">研一 AI+通信方向</p>
          </div>
          
          <div className="flex items-center mb-2">
            <div className="bg-yellow-100 p-1.5 rounded-full mr-3">
              <svg className="w-4 h-4 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd"></path>
              </svg>
            </div>
            <p className="text-gray-700 font-medium">正在努力打怪升级</p>
          </div>
          
          <div className="flex items-center">
            <div className="bg-red-100 p-1.5 rounded-full mr-3">
              <svg className="w-4 h-4 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path>
              </svg>
            </div>
            <p className="text-gray-700 font-medium">欢迎交流 信仰开源</p>
          </div>
        </div>
        
        <div className="w-full border-t border-gray-300 my-3"></div>
        
        <div className="flex justify-center space-x-6 mb-4">
          <Link href="https://github.com/DerrickLinus" target="_blank" className="text-gray-600 hover:text-blue-600 transform hover:scale-110 transition-all duration-300">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"></path>
            </svg>
          </Link>
          <Link href="https://blog.csdn.net/DLH_bianchenggou?spm=1010.2135.3001.5343" target="_blank" className="text-gray-600 hover:text-red-600 transform hover:scale-110 transition-all duration-300">
            <svg className="w-6 h-6" viewBox="0 0 1024 1024" fill="currentColor">
              <path d="M229.12 841.92c-170.88-237.76-46.4-629.12 236.16-716.8 118.4-38.08 262.72-16.96 351.36 74.24 48.64 43.2 1.28 102.4-24.96 141.76-81.92-62.4-179.2-143.04-289.92-102.08C303.36 310.4 232 593.28 338.24 764.8c128 141.44 358.08 94.08 488.64-20.48 42.88 37.12 88.96 112.32 24.64 153.92-182.4 120.96-474.24 120-622.4-56.32z" />
            </svg>
          </Link>
          <Link href="https://instagram.com/derrick_linushui" target="_blank" className="text-gray-600 hover:text-pink-600 transform hover:scale-110 transition-all duration-300">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
            </svg>
          </Link>
          <Link href="https://x.com/DrrickLinus" target="_blank" className="text-gray-600 hover:text-blue-400 transform hover:scale-110 transition-all duration-300">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
            </svg>
          </Link>
          <div 
            ref={emailRef}
            className="relative"
            onMouseEnter={() => setIsEmailHovered(true)}
            onMouseLeave={() => !showEmailModal && setIsEmailHovered(false)}
          >
            <button
              onClick={() => setShowEmailModal(!showEmailModal)}
              className="text-gray-600 hover:text-red-500 transform hover:scale-110 transition-all duration-300"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
              </svg>
            </button>
            
            {/* 邮箱悬浮框 */}
            {(isEmailHovered || showEmailModal) && (
              <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
                <div className="p-4 relative">
                  {showEmailModal && (
                    <button
                      onClick={() => {
                        setShowEmailModal(false);
                        setIsEmailHovered(false);
                      }}
                      className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">联系邮箱</h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 p-2 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors">
                      <svg className="w-5 h-5 text-red-500" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M20.283 10.356h-8.327v3.451h4.792c-.446 2.193-2.313 3.453-4.792 3.453a5.27 5.27 0 0 1-5.279-5.28 5.27 5.27 0 0 1 5.279-5.279c1.259 0 2.397.447 3.29 1.178l2.6-2.599c-1.584-1.381-3.615-2.233-5.89-2.233a8.908 8.908 0 0 0-8.934 8.934 8.907 8.907 0 0 0 8.934 8.934c4.467 0 8.529-3.249 8.529-8.934 0-.528-.081-1.097-.202-1.625z"/>
                      </svg>
                      <a href="mailto:doggd1124@gmail.com" className="text-blue-600 hover:underline">doggd1124@gmail.com</a>
                    </div>
                    <div className="flex items-center space-x-3 p-2 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors">
                      <svg className="w-5 h-5 text-red-500" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                      </svg>
                      <a href="mailto:cucdlh@163.com" className="text-blue-600 hover:underline">cucdlh@163.com</a>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <p className="text-sm text-gray-600 italic font-medium bg-gray-50 px-3 py-1 rounded-full border border-gray-200 shadow-sm">Stay Hungry, Stay Foolish</p>
      </div>
    </div>
  );
} 