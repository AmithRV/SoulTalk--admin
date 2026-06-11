'use client';
import moment from 'moment';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';
import { Loader2, RefreshCcw } from 'lucide-react';
import { getVisitor } from '@/lib/api-collection/visitors';

function Views() {
  //
  const { visitorId } = useParams();

  const [visitorDetails, setVisitorDetails] = useState<{
    data: any;
    loading: boolean;
  }>({ data: {}, loading: false });

  const handleGetVisitorDetails = () => {
    setVisitorDetails({ loading: true, data: [] });
    getVisitor(visitorId)
      .then((res) => {
        setVisitorDetails({ data: res.data, loading: false });
      })
      .catch((error: any) => {
        //
        const defaultMsg = 'Something went wrong';
        const message = error?.response?.data?.message;

        toast.error(message || defaultMsg);
        setVisitorDetails({ data: [], loading: false });
      });
  };

  const handleRefresh = () => {
    handleGetVisitorDetails();
  };

  useEffect(() => {
    handleGetVisitorDetails();
  }, []);

  return (
    <>
      <main className="flex-1 flex-col flex">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-700">
          <h1 className="text-lg font-medium">History</h1>
          <div className="flex">
            <button
              onClick={() => {
                handleRefresh();
              }}
              disabled={visitorDetails?.loading}
              className="ml-2 bg-blue-500 hover:bg-blue-600 px-2 py-1 rounded-[5px] text-sm font-bold cursor-pointer flex items-center disabled:bg-blue-400"
            >
              <RefreshCcw
                className={cn('w-4 h-4 mr-1', {
                  'animate-spin': visitorDetails?.loading,
                })}
              />
              <span>
                {visitorDetails?.loading ? 'Refreshing...' : 'Refresh'}
              </span>
            </button>
          </div>
        </div>

        <main className="flex-1 p-4 md:p-4 max-w-6xl w-full md:mx-auto md:mt-0">
          {/* Main Card Container */}
          <div className="border border-neutral-800 rounded-xl bg-[#0a0a0a] overflow-hidden flex flex-col shadow-2xl">
            {/* Card Body */}
            <div className="flex flex-col lg:flex-row p-5 md:p-6">
              <div className="w-full  flex flex-col relative">
                <div className="flex flex-col gap-5 pr-10">
                  {/* row-1 --mobile*/}
                  <div className="flex flex-col md:hidden">
                    <h3 className="text-[13px] text-neutral-400 font-medium mb-1.5">
                      Visitor Id
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-neutral-100">
                      <span>{visitorDetails?.data?.visitor?._id}</span>
                    </div>
                  </div>

                  <div className="flex flex-col md:hidden">
                    <h3 className="text-[13px] text-neutral-400 font-medium mb-1.5">
                      Visitor Name
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-neutral-100">
                      <span>{visitorDetails?.data?.visitor?.name}</span>
                    </div>
                  </div>

                  {/* row-1 --Desktop*/}
                  <div className=" grid-cols-2 gap-4 hidden md:grid">
                    <div>
                      <h3 className="text-[13px] text-neutral-400 font-medium mb-1.5">
                        Visitor Id
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-neutral-100">
                        <span>{visitorDetails?.data?.visitor?._id}</span>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-[13px] text-neutral-400 font-medium mb-1.5">
                        Visitor Name
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-neutral-100">
                        <span>{visitorDetails?.data?.visitor?.name}</span>
                      </div>
                    </div>
                  </div>

                  {/* row-2 */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-[13px] text-neutral-400 font-medium mb-1.5">
                        Country
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-neutral-100">
                        <span>{visitorDetails?.data?.visitor?.country}</span>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-[13px] text-neutral-400 font-medium mb-1.5">
                        Total Views
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-neutral-100">
                        <span>{visitorDetails?.data?.views?.length}</span>
                      </div>
                    </div>
                  </div>

                  {/* row-3 */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-[13px] text-neutral-400 font-medium mb-1.5">
                        First visit
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-neutral-100">
                        <span>
                          {moment(
                            visitorDetails?.data?.visitor?.createdAt,
                          ).format('DD-MMM-YY hh:mm A')}
                        </span>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-[13px] text-neutral-400 font-medium mb-1.5">
                        Last visit
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-neutral-100">
                        <span>
                          {moment(
                            visitorDetails?.data?.visitor?.updatedAt,
                          ).format('DD-MMM-YY hh:mm A')}
                        </span>
                      </div>
                    </div>
                  </div>
                  {/* row-4 */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-[13px] text-neutral-400 font-medium mb-1.5">
                        Total visits
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-neutral-100">
                        <span>
                          {visitorDetails?.data?.visitor?.totalVisits}
                        </span>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-[13px] text-neutral-400 font-medium mb-1.5">
                        Device
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-neutral-100 capitalize">
                        <span>{visitorDetails?.data?.visitor?.device}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>

        <p className="pl-4 text-purple-600 font-semibold mb-4">
          Total Views : {visitorDetails?.data?.views?.length}
        </p>
        {/* Desktop Views */}
        <div className="bg-[#1e1f23] text-white min-h-auto p-4 hidden md:block">
          <div className="bg-[#17181c] rounded-lg shadow-lg overflow-hidden">
            {/* Scroll Container */}
            <div className="max-h-[calc(100vh-140px)] overflow-y-auto no-scrollbar">
              <table className="w-full text-sm text-left border-collapse">
                {/* Sticky Header */}
                <thead className="bg-[#2a2b30] sticky top-0 z-10">
                  <tr>
                    <th className="px-6 py-3 w-12.5">#</th>
                    <th className="px-6 py-3 cursor-pointer">Page</th>
                    <th className="px-6 py-3">Country</th>
                    <th className="px-6 py-3 cursor-pointer">Visited At</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-700">
                  {!visitorDetails?.loading &&
                    visitorDetails?.data?.views?.length > 0 &&
                    visitorDetails?.data?.views?.map(
                      (view: any, index: number) => (
                        <tr key={view?._id} className="hover:bg-[#2a2b30]">
                          <td className="px-6 py-4 w-12.5">{index + 1}</td>
                          <td className="px-6 py-4">
                            <Link
                              href={`/pages/${view?.page?._id}`}
                              className="border-b border-dotted"
                            >
                              {view?.page?.name}
                            </Link>
                          </td>
                          <td className="px-6 py-4">
                            {view?.country || 'N/A'}
                          </td>
                          <td className="px-6 py-4">
                            {moment(view?.createdAt).format(
                              'DD-MMM-YY hh:mm A',
                            )}
                          </td>
                        </tr>
                      ),
                    )}

                  {!visitorDetails?.loading &&
                    visitorDetails?.data?.length === 0 && (
                      <tr className="hover:bg-[#2a2b30]">
                        <td
                          className="px-6 py-4 uppercase text-center font-bold"
                          colSpan={7}
                        >
                          no views available
                        </td>
                      </tr>
                    )}

                  {visitorDetails?.loading && (
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

        {/* Mobile Views */}
        <div className="flex flex-col gap-4 md:hidden ">
          {!visitorDetails?.loading &&
            visitorDetails?.data?.views?.length > 0 &&
            visitorDetails?.data?.views.map((view: any, index: number) => (
              <div
                key={index}
                className="bg-[#202024] rounded-lg p-4 mx-4 border border-[#2d2d33] shadow-sm"
              >
                <div className="flex justify-between items-start mb-3">
                  <h2 className="text-base text-gray-100 dashed-underline leading-tight pr-4">
                    <Link
                      className="border-b border-dotted"
                      href={`/pages/${view?.page?._id}`}
                    >
                      {view?.page?.name}
                    </Link>
                  </h2>
                  <span className="text-xs font-mono text-gray-400 bg-[#2d2d33] px-2 py-1 rounded">
                    #{index + 1}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs text-gray-400 mb-4">
                  <div>
                    <span className="block text-gray-500 mb-1">Country</span>
                    <span className="text-gray-300">{view?.country}</span>
                  </div>
                  <div>
                    <span className="block text-gray-500 mb-1">
                      {' '}
                      Visited At
                    </span>
                    <span className="text-gray-300">
                      {' '}
                      {moment(view?.createdAt).format('DD-MMM-YY hh:mm A')}{' '}
                    </span>
                  </div>
                </div>
              </div>
            ))}

          {visitorDetails?.loading && (
            <div className="hover:bg-[#2a2b30]">
              <div className="w-full px-6 py-4 uppercase text-center font-bold">
                <div className="flex justify-center items-center">
                  <Loader2 className="animate-spin mr-2 w-4 h-4" />
                  loading views
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Toaster />
    </>
  );
}

export default Views;
