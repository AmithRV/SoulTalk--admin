'use client';
import moment from 'moment';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { Loader2, RefreshCcw } from 'lucide-react';
import { listViews } from '@/lib/api-collection/views';

function Views() {
  //
  const [views, setViews] = useState({ loading: true, data: [] });

  const handleListViews = () => {
    setViews({ loading: true, data: [] });
    listViews()
      .then((res) => {
        console.log('views : ', res.data);

        setViews({ data: res.data, loading: false });
      })
      .catch((error: any) => {
        //
        const defaultMsg = 'Something went wrong';
        const message = error?.response?.data?.message;

        toast.error(message || defaultMsg);
        setViews({ data: [], loading: false });
      });
  };
  const handleRefresh = () => {
    handleListViews();
  };

  useEffect(() => {
    handleListViews();
  }, []);

  return (
    <>
      <main className="flex-1 flex-col  hidden md:flex">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-700">
          <h1 className="text-lg font-medium">Views</h1>
          <div className="flex">
            <button
              onClick={() => {
                handleRefresh();
              }}
              disabled={views?.loading}
              className="ml-2 bg-blue-500 hover:bg-blue-600 px-2 py-1 rounded-[5px] text-sm font-bold cursor-pointer flex items-center disabled:bg-blue-400"
            >
              <RefreshCcw
                className={cn('w-4 h-4 mr-1', {
                  'animate-spin': views?.loading,
                })}
              />
              <span>{views?.loading ? 'Refreshing...' : 'Refresh'}</span>
            </button>
          </div>
        </div>
        <p className="pl-4 pt-4 text-purple-600 font-semibold">
          Total Views : {views?.data?.length}
        </p>
        {/* Center Content */}
        <div className="bg-[#1e1f23] text-white min-h-auto p-4">
          <div className="bg-[#17181c] rounded-lg shadow-lg overflow-hidden">
            {/* Scroll Container */}
            <div className="max-h-[calc(100vh-140px)] overflow-y-auto no-scrollbar">
              <table className="w-full text-sm text-left border-collapse">
                {/* Sticky Header */}
                <thead className="bg-[#2a2b30] sticky top-0 z-10">
                  <tr>
                    <th className="px-6 py-3 w-12.5">#</th>
                    <th className="px-6 py-3">Visitor Id</th>
                    <th className="px-6 py-3 cursor-pointer">Page</th>
                    <th className="px-6 py-3">Country</th>
                    <th className="px-6 py-3 cursor-pointer">visited At</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-700">
                  {!views?.loading &&
                    views?.data?.length > 0 &&
                    views?.data.map((view: any, index) => (
                      <tr key={view?._id} className="hover:bg-[#2a2b30]">
                        <td className="px-6 py-4 w-12.5">{index + 1}</td>
                        <td className="px-6 py-4">
                          {view?.visitorId || 'N/A'}
                        </td>
                        <td className="px-6 py-4 ">
                          <Link
                            className="border-b border-dotted"
                            href={`/pages/${view?.page?._id}`}
                          >
                            {view?.page?.name}
                          </Link>
                        </td>
                        <td className="px-6 py-4">{view?.country || 'N/A'}</td>
                        <td className="px-6 py-4">
                          {moment(view?.createdAt).format('DD-MMM-YY hh:mm A')}
                        </td>
                      </tr>
                    ))}

                  {!views?.loading && views?.data?.length === 0 && (
                    <tr className="hover:bg-[#2a2b30]">
                      <td
                        className="px-6 py-4 uppercase text-center font-bold"
                        colSpan={7}
                      >
                        no views available
                      </td>
                    </tr>
                  )}

                  {views?.loading && (
                    <tr className="hover:bg-[#2a2b30]">
                      <td
                        className="w-full px-6 py-4 uppercase text-center font-bold"
                        colSpan={7}
                      >
                        <div className="flex justify-center items-center">
                          <Loader2 className="animate-spin mr-2 w-4 h-4" />
                          loading views
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      <Toaster />
    </>
  );
}

export default Views;
