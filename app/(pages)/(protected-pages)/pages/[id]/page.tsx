'use client';
import moment from 'moment';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { getPage } from '@/lib/api-collection/pages';

function PageDetails() {
  //
  const { id } = useParams();

  const [pageDetails, setPageDetails] = useState<{
    data: any;
    loading: boolean;
  }>({ data: {}, loading: false });

  const handleGetPageDetails = () => {
    setPageDetails({ loading: true, data: [] });
    getPage(id)
      .then((res) => {
        setPageDetails({ data: res.data.page, loading: false });
      })
      .catch((error: any) => {
        //
        const defaultMsg = 'Something went wrong';
        const message = error?.response?.data?.message;

        toast.error(message || defaultMsg);
        setPageDetails({ data: [], loading: false });
      });
  };

  useEffect(() => {
    handleGetPageDetails();
  }, []);

  return (
    <>
      <div className="w-full flex flex-col bg-black text-[#ededed] font-sans">
        {/* Top Navigation */}
        <header className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-black sticky top-0 z-10">
          <div className="flex items-center gap-3 text-sm text-neutral-200 font-medium">
            <span className="font-semibold text-[18px] text-white">
              {pageDetails?.data?.name}
            </span>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-6 md:p-8 max-w-6xl mx-auto w-full">
          {/* Main Card Container */}
          <div className="border border-neutral-800 rounded-xl bg-[#0a0a0a] overflow-hidden flex flex-col shadow-2xl">
            {/* Card Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 md:px-6 border-b border-neutral-800 gap-4">
              <h2 className="text-base font-semibold text-white flex items-center">
                Total Views :{' '}
                <span className="ml-1 pt-0.5">{pageDetails?.data?.views}</span>
              </h2>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <div className="flex items-stretch shadow-sm">
                  <a
                    target="_blank"
                    href={pageDetails?.data?.publicUrl}
                    className="flex items-center justify-center px-4 py-1.5 text-sm font-medium bg-white text-black hover:bg-neutral-200 rounded transition-colors border border-transparent"
                  >
                    Visit
                  </a>
                </div>
              </div>
            </div>

            {/* Card Body */}
            <div className="flex flex-col lg:flex-row p-5 md:p-6 gap-8">
              {/* Left: Thumbnail Preview */}
              <div className="w-full lg:w-2/5 flex flex-col border border-neutral-800 rounded-lg overflow-hidden bg-[#0a0a0a]">
                {/* Image section with pink background */}
                <div className="bg-[#dda8a8] h-64 flex items-center justify-center p-4 relative">
                  {/* Mock Login Box */}
                  <div className="w-48 bg-white rounded-lg shadow-xl overflow-hidden flex flex-col border border-black/5">
                    <div className="bg-black text-center py-4 flex flex-col items-center">
                      <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center mb-2">
                        <svg
                          className="w-4 h-4 text-black"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <h3 className="text-white text-[10px] font-bold">
                        Welcome Back
                      </h3>
                      <p className="text-[6px] text-neutral-400 mt-1">
                        Sign in to continue
                      </p>
                    </div>
                    <div className="p-3 bg-white flex flex-col gap-2">
                      <div>
                        <label className="text-[6px] text-neutral-600 font-medium block mb-1">
                          Email Address
                        </label>
                        <div className="border border-neutral-200 rounded text-[6px] text-neutral-400 p-1.5 flex items-center gap-1">
                          <svg
                            className="w-2 h-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                            />
                          </svg>
                          Enter your email
                        </div>
                      </div>
                      <div>
                        <label className="text-[6px] text-neutral-600 font-medium block mb-1">
                          Password
                        </label>
                        <div className="border border-neutral-200 rounded text-[6px] text-neutral-400 p-1.5 flex justify-between items-center">
                          <div className="flex items-center gap-1">
                            <svg
                              className="w-2 h-2"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                              />
                            </svg>
                            Enter your password
                          </div>
                          <svg
                            className="w-2 h-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                            />
                          </svg>
                        </div>
                      </div>
                      <div className="bg-black text-white text-[8px] text-center rounded py-1.5 mt-1 font-medium">
                        Sign In
                      </div>
                    </div>
                  </div>
                </div>
                {/* Bottom Dark Bar of thumbnail container */}
                <div className="bg-[#0a0a0a] h-12"></div>
              </div>

              {/* Right: Details */}
              <div className="w-full lg:w-3/5 flex flex-col relative">
                <div className="flex flex-col gap-5 pr-10">
                  {/* Deployment Row */}
                  <div>
                    <h3 className="text-[13px] text-neutral-400 font-medium mb-1.5 capitalize">
                      public url
                    </h3>
                    <a
                      href="#"
                      className="text-sm text-neutral-100 hover:text-white hover:underline transition"
                    >
                      {pageDetails?.data?.publicUrl}
                    </a>
                  </div>

                  {/* Domains Row */}
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <h3 className="text-[13px] text-neutral-400 font-medium">
                        Description
                      </h3>
                    </div>
                    <p className="text-sm text-neutral-100 hover:text-white flex items-center gap-1.5 transition">
                      {pageDetails?.data?.description}
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <h3 className="text-[13px] text-neutral-400 font-medium">
                        Url
                      </h3>
                    </div>
                    <a
                      target="_blank"
                      href={pageDetails?.data?.publicUrl}
                      className="text-sm text-neutral-100 hover:text-white flex items-center gap-1.5 transition"
                    >
                      {pageDetails?.data?.url}
                    </a>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <h3 className="text-[13px] text-neutral-400 font-medium">
                        Category
                      </h3>
                    </div>
                    <Link
                      href={`/categories/${pageDetails?.data?.categories?._id}`}
                      className="text-sm text-neutral-100 hover:text-white flex items-center gap-1.5 transition"
                    >
                      {pageDetails?.data?.categories?.name}
                    </Link>
                  </div>

                  {/* Status & Created Row */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-[13px] text-neutral-400 font-medium mb-1.5">
                        Updated
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-neutral-100">
                        <span>
                          {moment(pageDetails?.data?.updatedAt).format(
                            'DD-MMM-YY hh:mm A',
                          )}
                        </span>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-[13px] text-neutral-400 font-medium mb-1.5">
                        Created
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-neutral-100">
                        <span>
                          {moment(pageDetails?.data?.createdAt).format(
                            'DD-MMM-YY hh:mm A',
                          )}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Source Row */}
                  <div>
                    <div className="flex flex-col gap-1.5 text-sm text-neutral-200">
                      {/* Branch */}
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs mt-0.5">
                          Page Id
                        </span>
                      </div>
                      {/* Commit */}
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs text-neutral-400">
                          {pageDetails?.data?._id}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
      <Toaster />
    </>
  );
}

export default PageDetails;
