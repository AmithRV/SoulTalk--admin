'use client';
import moment from 'moment';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { Loader2, RefreshCcw } from 'lucide-react';
import { listVisitor } from '@/lib/api-collection/visitors';

function Visitors() {
  //
  const [visitors, setVisitors] = useState({ loading: true, data: [] });

  const handleListVisitors = () => {
    setVisitors({ loading: true, data: [] });
    listVisitor()
      .then((res) => {
        console.log('=> ', res.data);

        setVisitors({ data: res.data, loading: false });
      })
      .catch((error: any) => {
        //
        const defaultMsg = 'Something went wrong';
        const message = error?.response?.data?.message;

        toast.error(message || defaultMsg);
        setVisitors({ data: [], loading: false });
      });
  };
  const handleRefresh = () => {
    handleListVisitors();
  };

  useEffect(() => {
    handleListVisitors();
  }, []);

  return (
    <>
      <main className="flex-1 flex-col  hidden md:flex">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-700">
          <h1 className="text-lg font-medium">Visitors</h1>
          <div className="flex">
            <button
              onClick={() => {
                handleRefresh();
              }}
              disabled={visitors?.loading}
              className="ml-2 bg-blue-500 hover:bg-blue-600 px-2 py-1 rounded-[5px] text-sm font-bold cursor-pointer flex items-center disabled:bg-blue-400"
            >
              <RefreshCcw
                className={cn('w-4 h-4 mr-1', {
                  'animate-spin': visitors?.loading,
                })}
              />
              <span>{visitors?.loading ? 'Refreshing...' : 'Refresh'}</span>
            </button>
          </div>
        </div>
        <p className="pl-4 pt-4 text-purple-600 font-semibold">
          Total Visitors : {visitors?.data?.length}
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
                    <th className="px-6 py-3 cursor-pointer">Country</th>
                    <th className="px-6 py-3">First visit</th>
                    <th className="px-6 py-3">Last visit</th>
                    <th className="px-6 py-3">Total visits</th>
                    <th className="px-6 py-3">Device</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-700">
                  {!visitors?.loading &&
                    visitors?.data?.length > 0 &&
                    visitors?.data.map((visitor: any, index) => (
                      <tr key={visitor?._id} className="hover:bg-[#2a2b30]">
                        <td className="px-6 py-4 w-12.5">{index + 1}</td>
                        <td className="px-6 py-4">{visitor?._id}</td>
                        <td className="px-6 py-4">{visitor?.country}</td>
                        <td className="px-6 py-4">
                          {moment(visitor?.createdAt).format(
                            'DD-MMM-YY hh:mm A',
                          )}
                        </td>
                        <td className="px-6 py-4">
                          {' '}
                          {moment(visitor?.updatedAt).format(
                            'DD-MMM-YY hh:mm A',
                          )}{' '}
                        </td>
                        <td className="px-6 py-4">{visitor?.totalVisits} </td>
                        <td className="px-6 py-4">{visitor?.device} </td>
                      </tr>
                    ))}

                  {!visitors?.loading && visitors?.data?.length === 0 && (
                    <tr className="hover:bg-[#2a2b30]">
                      <td
                        className="px-6 py-4 uppercase text-center font-bold"
                        colSpan={7}
                      >
                        no visitors available
                      </td>
                    </tr>
                  )}

                  {visitors?.loading && (
                    <tr className="hover:bg-[#2a2b30]">
                      <td
                        className="w-full px-6 py-4 uppercase text-center font-bold"
                        colSpan={7}
                      >
                        <div className="flex justify-center items-center">
                          <Loader2 className="animate-spin mr-2 w-4 h-4" />
                          loading visitors
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

export default Visitors;
