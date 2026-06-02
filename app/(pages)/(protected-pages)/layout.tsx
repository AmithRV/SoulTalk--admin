'use client';
import Link from 'next/link';
import { show } from '@/types/show';
import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { LogoutModal } from '@/components/modals';
import { logout } from '@/lib/api-collection/auth';
import { useParams, useRouter } from 'next/navigation';

function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const pathname = usePathname();
  const { id } = useParams();

  const [show, setShow] = useState<show>({ state: false, type: '' });
  const [loading, setLoading] = useState({ type: '', state: false });

  const menu = [
    { name: 'Pages', link: '/', activeUrls: ['/', `/pages/${id}`] },
    { name: 'Comments', link: '/comments', activeUrls: ['/comments'] },
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
      <div className="flex h-screen bg-[#1e1f23] text-white font-sans overflow-auto">
        {/* Sidebar */}
        <aside className="w-64 bg-[#17181c] p-4 flex-col justify-between hidden md:flex">
          <div>
            <button className="w-full bg-[#2a2b30] hover:bg-[#34353b] text-left px-4 py-2 rounded-lg mb-4">
              SoulTalk
            </button>

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

        {children}
      </div>
      <LogoutModal
        onClose={onClose}
        open={show.state && show.type === 'logout'}
        handleLogout={handleLogout}
        loading={loading.state && loading.type === 'logout'}
      />
    </>
  );
}

export default Layout;
