import React from 'react';
import Link from 'next/link';
import { show } from '@/types/show';
import { useParams, usePathname } from 'next/navigation';

function MobileBottomSheet({
  setShow,
  open = false,
  setIsMobileNavOpen,
}: {
  open: boolean;
  setShow: React.Dispatch<React.SetStateAction<show>>;
  setIsMobileNavOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  //
  const { id, visitorId, categoryId } = useParams();
  const pathname = usePathname();

  const menu = [
    { name: 'Pages', link: '/', activeUrls: ['/', `/pages/${id}`] },
    { name: 'Comments', link: '/comments', activeUrls: ['/comments'] },
    { name: 'Views', link: '/views', activeUrls: ['/views'] },
    {
      name: 'Visitors',
      link: '/visitors',
      activeUrls: ['/visitors', `/visitors/${visitorId}`],
    },
    {
      name: 'Categories',
      link: '/categories',
      activeUrls: ['/categories', `/categories/${categoryId}`],
    },
  ];

  return (
    <>
      <div
        onClick={() => setIsMobileNavOpen(false)}
        className={`fixed inset-0 bg-black/50 transition-all duration-300 z-40 ${
          open ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
      />

      <div
        className={`fixed bottom-0 left-0 right-0 bg-[#202024] rounded-t-3xl shadow-xl z-50 transform transition-transform duration-300 ${
          open ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        <div className="p-4">
          {/* Handle */}
          <div className="w-12 h-1.5 bg-gray-600 rounded-full mx-auto mb-6" />

          <nav className="space-y-2">
            {menu.map((item) => (
              <Link
                key={item.name}
                href={item.link}
                className={`block px-4 py-3 text-white rounded-lg hover:bg-gray-600 cursor-pointer ${item.activeUrls.includes(pathname) ? 'bg-purple-600 text-white' : ''}`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          <button
            onClick={() => {
              setIsMobileNavOpen(false);
              setShow({ type: 'logout', state: true });
            }}
            className="flex justify-start px-4 py-3 text-red-500 rounded-lg cursor-pointer hover:bg-gray-600 w-full"
          >
            Logout
          </button>

          <button
            onClick={() => setIsMobileNavOpen(false)}
            className="w-full mt-6 py-3 text-white bg-gray-600 rounded-lg hover:bg-gray-700 cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </>
  );
}

export default MobileBottomSheet;
