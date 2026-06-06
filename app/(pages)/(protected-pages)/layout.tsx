'use client';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { show } from '@/types/show';
import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { LogoutModal } from '@/components/modals';
import { logout } from '@/lib/api-collection/auth';
import { useParams, useRouter } from 'next/navigation';
import { Menu, PanelRightClose, X } from 'lucide-react';
import { MobileBottomSheet } from '@/components/layout';

function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const { id } = useParams();
  const pathname = usePathname();

  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isDesktopNavOpen, setIsDesktopNavOpen] = useState(true);
  const [show, setShow] = useState<show>({ state: false, type: '' });
  const [loading, setLoading] = useState({ type: '', state: false });

  const menu = [
    { name: 'Pages', link: '/', activeUrls: ['/', `/pages/${id}`] },
    { name: 'Comments', link: '/comments', activeUrls: ['/comments'] },
    { name: 'Views', link: '/views', activeUrls: ['/views'] },
    { name: 'Visitors', link: '/visitors', activeUrls: ['/visitors'] },
  ];

  const onClose = () => {
    setShow({ state: false, type: '' });
  };

  const handleLogout = () => {
    setLoading({ type: 'logout', state: true });
    logout()
      .then(() => {
        router.push('/auth/login');
      })
      .finally(() => {
        setLoading({ type: 'logout', state: false });
      });
  };

  return (
    <>
      <div className="h-screen bg-[#1e1f23] text-white font-sans overflow-auto flex ">
        {/* Sidebar Desktop */}
        <aside
          className={cn(
            'w-64 bg-[#17181c] p-4 flex-col justify-between hidden md:flex',
            { 'md:hidden': !isDesktopNavOpen },
          )}
        >
          <div className="relative">
            <button className="w-full bg-[#2a2b30] hover:bg-[#34353b] text-2xl font-serif font-bold text-left p-2 rounded-lg ">
              Soul<span className="text-[#a855f7]">Talk</span>
            </button>
            <a
              href="#"
              onClick={() => {
                setIsDesktopNavOpen(false);
              }}
              className="absolute -top-2.5 ml-2 bg-[#36373d] rounded-[50%] cursor-pointer"
            >
              <X />
            </a>
            <div className="mt-6">
              <div className="space-y-2 text-sm flex flex-col">
                {menu.map((item) => (
                  <Link
                    key={item.name}
                    href={item.link}
                    className={`hover:text-white cursor-pointer text-[16px] p-1 rounded-lg w-full pl-2 ${item.activeUrls.includes(pathname) ? 'bg-purple-600 text-white' : ''}`}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
          {/* Profile */}
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-2">
              <div className="bg-green-500 w-8 h-8 rounded-full flex items-center justify-center text-sm">
                AM
              </div>
              <div>
                <p className="text-sm">Amith RV</p>
                <p className="text-xs text-gray-400">Admin</p>
              </div>
            </div>
            <button
              onClick={() => {
                setShow({ type: 'logout', state: true });
              }}
              className="text-xs bg-[#2a2b30] px-2 py-1 rounded cursor-pointer"
            >
              Logout
            </button>
          </div>
        </aside>

        <PanelRightClose
          onClick={() => {
            setIsDesktopNavOpen(true);
          }}
          // className=
          className={cn(
            'text-gray-200 mt-4 ml-1 cursor-pointer hidden md:block ',
            { 'md:hidden': isDesktopNavOpen },
          )}
        />

        {/* Sidebar Mobile */}
        <div className="w-screen overflow-y-auto no-scrollbar">
          <header className="flex justify-between items-center p-4 bg-[#202024] border-b border-[#2d2d33] fixed top-0 z-10  md:hidden w-full">
            <div className="text-xl font-serif font-bold tracking-wide">
              Soul<span className="text-[#a855f7]">Talk</span>
            </div>
            <button
              onClick={() => setIsMobileNavOpen(true)}
              className="text-gray-400 hover:text-white p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600 cursor-pointer"
            >
              <Menu />
            </button>
          </header>

          {children}
        </div>
      </div>

      <LogoutModal
        onClose={onClose}
        open={show.state && show.type === 'logout'}
        handleLogout={handleLogout}
        loading={loading.state && loading.type === 'logout'}
      />

      <MobileBottomSheet
        setShow={setShow}
        open={isMobileNavOpen}
        setIsMobileNavOpen={setIsMobileNavOpen}
      />
    </>
  );
}

export default Layout;
