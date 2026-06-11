'use client';
import {
  Edit,
  Trash2,
  Loader2,
  RefreshCcw,
  SquareTerminal,
  SquareArrowOutUpRight,
} from 'lucide-react';
import moment from 'moment';
import Link from 'next/link';
import {
  MyTooltip,
  JsonPreviewModal,
  DeleteConfirmationModal,
} from '@/components/modals';
import { cn } from '@/lib/utils';
import {
  addPages,
  listPages,
  deletePage,
  updatePage,
} from '@/lib/api-collection/pages';
import { show } from '@/types/index';
import { useEffect, useState } from 'react';
import { TopBar } from '@/components/layout';
import toast, { Toaster } from 'react-hot-toast';
import { AddPageModal, EditPageModal } from '@/components/modals/Page';

function Pages() {
  //
  const [pages, setPages] = useState({ loading: true, data: [] });
  const [loading, setLoading] = useState({ type: '', state: false });
  const [show, setShow] = useState<show>({ state: false, type: '' });

  const onClose = () => {
    setShow({ state: false, type: '' });
  };

  const handleSort = (type: string) => {
    // 1. Create a shallow copy of the data array to avoid mutating React state directly
    const sortedData = [...pages.data].sort((a: any, b: any) => {
      const valueA = a[type];
      const valueB = b[type];

      // Safety check for undefined properties
      if (valueA === undefined || valueB === undefined) return 0;

      // 2. Handle Numbers (e.g., sorting by 'views')
      if (typeof valueA === 'number' && typeof valueB === 'number') {
        return valueA - valueB; // Ascending order
      }

      // 3. Handle Strings and Date Strings (e.g., sorting by 'name' or 'createdAt')
      if (typeof valueA === 'string' && typeof valueB === 'string') {
        // localeCompare handles alphabetical sorting and works perfectly for ISO date strings too
        return valueA.localeCompare(valueB);
      }

      return 0;
    });

    // 4. Update the state while preserving the 'loading' flag
    setPages((prevPages) => ({
      ...prevPages,
      data: sortedData,
    }));
  };

  const handleListPages = () => {
    setPages((prev) => ({
      ...prev,
      loading: true,
    }));
    listPages()
      .then((res) => {
        setPages({ data: res.data, loading: false });
      })
      .catch((error: any) => {
        //
        const defaultMsg = 'Something went wrong';
        const message = error?.response?.data?.message;

        toast.error(message || defaultMsg);
        setPages({ data: [], loading: false });
      });
  };

  const handleAddPage = (formData: any) => {
    setLoading({ type: 'add-page', state: true });
    addPages(formData)
      .then((res) => {
        setPages((prev: any) => ({
          ...prev,
          data: [{ ...res?.page, comments: 0, views: 0 }, ...prev.data],
        }));
        toast.success(res.message);
        onClose();
      })
      .catch((error: any) => {
        //
        const defaultMsg = 'Something went wrong';
        const message = error?.response?.data?.message;

        toast.error(message || defaultMsg);
      })
      .finally(() => {
        setLoading({ type: 'add-page', state: false });
      });
  };

  const handleDeletePage = () => {
    const pageId = show?.data?.id;
    setLoading({ type: 'delete-page', state: true });
    deletePage(pageId)
      .then((res) => {
        setPages((prev) => ({
          ...prev,
          data: prev.data.filter((page: any) => page._id !== pageId),
        }));
        toast.success(res.message);
        onClose();
      })
      .catch((error: any) => {
        //
        const defaultMsg = 'Something went wrong';
        const message = error?.response?.data?.message;

        toast.error(message || defaultMsg);
      })
      .finally(() => {
        setLoading({ type: 'delete-page', state: false });
      });
  };

  const handleUpdatePage = (formData: any) => {
    setLoading({ type: 'edit-page', state: true });
    updatePage(formData)
      .then((res) => {
        handleListPages();
        toast.success(res.message);
        onClose();
      })
      .catch((error: any) => {
        //
        const defaultMsg = 'Something went wrong';
        const message = error?.response?.data?.message;

        toast.error(message || defaultMsg);
      })
      .finally(() => {
        setLoading({ type: 'edit-page', state: false });
      });
  };

  const handleRefresh = () => {
    handleListPages();
  };

  useEffect(() => {
    handleRefresh();
  }, []);

  return (
    <>
      <main className="flex-1 flex-col  hidden md:flex">
        <TopBar
          label={`Pages (${pages?.data?.length || 0})`}
          setShow={setShow}
          btnlabel="Add Page"
          actionType="add-page"
          handleRefresh={handleRefresh}
          loading={pages?.loading}
        />
        <p className="pl-4 pt-4 text-purple-600 font-semibold">
          Total Views :{' '}
          {pages?.data?.reduce((sum, item: any) => sum + item.views, 0)}
        </p>
        {/* Center Content */}
        <div className="bg-[#1e1f23] text-white min-h-auto p-4">
          <div className="bg-[#17181c] rounded-lg shadow-lg overflow-hidden">
            {/* Scroll Container */}
            <div className="max-h-[calc(100vh-100px)] overflow-y-auto">
              <table className="w-full text-sm text-left border-collapse">
                {/* Sticky Header */}
                <thead className="bg-[#2a2b30] sticky top-0 z-10">
                  <tr>
                    <th className="px-6 py-3 w-12.5">#</th>
                    <th className="px-6 py-3">Name</th>
                    <th
                      className="px-6 py-3 cursor-pointer"
                      onClick={() => handleSort('views')}
                    >
                      Views
                    </th>
                    <th className="px-6 py-3">Comments</th>
                    <th
                      className="px-6 py-3 cursor-pointer"
                      onClick={() => handleSort('createdAt')}
                    >
                      Created At
                    </th>
                    <th
                      className="px-6 py-3 cursor-pointer"
                      onClick={() => handleSort('updatedAt')}
                    >
                      Updated At
                    </th>
                    <th className="px-6 py-3">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-700">
                  {!pages?.loading &&
                    pages?.data?.length > 0 &&
                    pages?.data.map((page: any, index) => (
                      <tr key={page?._id} className="hover:bg-[#2a2b30]">
                        <td className="px-6 py-4 w-12.5">{index + 1}</td>
                        <td className="px-6 py-4 ">
                          <Link
                            className="border-b border-dotted"
                            href={`/pages/${page?._id}`}
                          >
                            {page?.name}
                          </Link>
                        </td>
                        <td className="px-6 py-4">{page?.views}</td>
                        <td className="px-6 py-4">{page?.comments || 0}</td>

                        <td className="px-6 py-4">
                          {moment(page?.createdAt).format('DD-MMM-YY hh:mm A')}
                        </td>
                        <td className="px-6 py-4">
                          {moment(page?.updatedAt).format('DD-MMM-YY hh:mm A')}
                        </td>
                        <td className="px-6 py-4 text-green-400 flex items-center gap-4">
                          <MyTooltip content="Edit Page">
                            <Edit
                              onClick={() => {
                                setShow({
                                  state: true,
                                  type: 'edit-page',
                                  data: {
                                    id: page?._id,
                                    name: page?.name,
                                    page,
                                  },
                                });
                              }}
                              className="w-5 h-5 text-gray-400 cursor-pointer"
                            />
                          </MyTooltip>

                          <MyTooltip content="View Page Details">
                            <SquareTerminal
                              onClick={() => {
                                setShow({
                                  state: true,
                                  type: 'preview-json',
                                  data: {
                                    json: page,
                                  },
                                });
                              }}
                              className="w-5 h-5 text-gray-400 ursor-pointer cursor-pointer"
                            />
                          </MyTooltip>

                          <MyTooltip content="Open Page">
                            <SquareArrowOutUpRight
                              onClick={() => {
                                window.open(
                                  `${process.env.NEXT_PUBLIC_DOMAIN}/${page?.publicUrl}`,
                                  '_blank',
                                );
                              }}
                              className="w-5 h-5 text-gray-400 cursor-pointer"
                            />
                          </MyTooltip>

                          <MyTooltip content="Delete Page">
                            <Trash2
                              onClick={() => {
                                setShow({
                                  state: true,
                                  type: 'delete-page',
                                  data: {
                                    id: page?._id,
                                    name: page?.name,
                                  },
                                });
                              }}
                              className="w-5 h-5 text-red-400 cursor-pointer"
                            />
                          </MyTooltip>
                        </td>
                      </tr>
                    ))}

                  {!pages?.loading && pages?.data?.length === 0 && (
                    <tr className="hover:bg-[#2a2b30]">
                      <td
                        className="px-6 py-4 uppercase text-center font-bold"
                        colSpan={7}
                      >
                        no pages available
                      </td>
                    </tr>
                  )}

                  {pages?.loading && (
                    <tr className="hover:bg-[#2a2b30]">
                      <td
                        className="w-full px-6 py-4 uppercase text-center font-bold"
                        colSpan={7}
                      >
                        <div className="flex justify-center items-center">
                          <Loader2 className="animate-spin mr-2 w-4 h-4" />
                          loading pages
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

      <main className="flex-1 p-4 max-w-lg mx-auto w-full overflow-y-auto flex md:hidden flex-col mt-16">
        <div className="flex flex-col gap-4 mb-6">
          <h1 className="text-2xl font-medium text-white">
            Pages ({pages?.data?.length || 0})
          </h1>

          <div className="flex gap-3">
            <button
              onClick={() => {
                setShow({ type: 'add-page', state: true });
              }}
              className="bg-[#9333ea] hover:bg-purple-600 text-white px-4 py-2.5 rounded-md font-medium text-sm flex-1 shadow-sm transition-colors cursor-pointer"
            >
              Add Page
            </button>
            <button
              onClick={handleRefresh}
              className="bg-[#2563eb] hover:bg-blue-600 text-white px-4 py-2.5 rounded-md font-medium text-sm flex items-center justify-center gap-2 flex-1 shadow-sm transition-colors cursor-pointer"
            >
              <RefreshCcw
                className={cn('w-4 h-4 mr-1', {
                  'animate-spin': pages?.loading,
                })}
              />
              Refresh
            </button>
          </div>
        </div>

        <div className="text-[#a855f7] font-medium mb-4 text-sm tracking-wide">
          Total Views :{' '}
          {pages?.data?.reduce((sum, item: any) => sum + item.views, 0)}
        </div>

        <div className="flex flex-col gap-4">
          {!pages?.loading &&
            pages?.data?.length > 0 &&
            pages?.data.map((page: any, index) => (
              <div
                key={index}
                className="bg-[#202024] rounded-lg p-4 border border-[#2d2d33] shadow-sm"
              >
                <div className="flex justify-between items-start mb-3">
                  <h2 className="text-base text-gray-100 dashed-underline leading-tight pr-4">
                    <Link
                      className="border-b border-dotted"
                      href={`/pages/${page?._id}`}
                    >
                      {page?.name}
                    </Link>
                  </h2>
                  <span className="text-xs font-mono text-gray-400 bg-[#2d2d33] px-2 py-1 rounded">
                    #{index + 1}
                  </span>
                </div>

                <div className="flex gap-6 text-sm text-gray-400 mb-4 bg-[#18181b] p-3 rounded-md">
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                      Views
                    </span>
                    <span className="text-gray-200 font-medium text-base">
                      {page?.views}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                      Comments
                    </span>
                    <span className="text-gray-200 font-medium text-base">
                      {page?.comments || 0}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs text-gray-400 mb-4">
                  <div>
                    <span className="block text-gray-500 mb-1">Created At</span>
                    <span className="text-gray-300">
                      {moment(page?.createdAt).format('DD-MMM-YY hh:mm A')}
                    </span>
                  </div>
                  <div>
                    <span className="block text-gray-500 mb-1">Updated At</span>
                    <span className="text-gray-300">
                      {moment(page?.updatedAt).format('DD-MMM-YY hh:mm A')}
                    </span>
                  </div>
                </div>

                <div className="flex gap-5 pt-3 border-t border-[#2d2d33] justify-end text-gray-400 text-lg">
                  <MyTooltip content="Edit Page">
                    <Edit
                      onClick={() => {
                        setShow({
                          state: true,
                          type: 'edit-page',
                          data: {
                            id: page?._id,
                            name: page?.name,
                            page,
                          },
                        });
                      }}
                      className="w-5 h-5 text-gray-400 cursor-pointer"
                    />
                  </MyTooltip>

                  <MyTooltip content="View Page Details">
                    <SquareTerminal
                      onClick={() => {
                        setShow({
                          state: true,
                          type: 'preview-json',
                          data: {
                            json: page,
                          },
                        });
                      }}
                      className="w-5 h-5 text-gray-400 ursor-pointer cursor-pointer"
                    />
                  </MyTooltip>

                  <MyTooltip content="Open Page">
                    <SquareArrowOutUpRight
                      onClick={() => {
                        window.open(
                          `${process.env.NEXT_PUBLIC_DOMAIN}/${page?.publicUrl}`,
                          '_blank',
                        );
                      }}
                      className="w-5 h-5 text-gray-400 cursor-pointer"
                    />
                  </MyTooltip>

                  <MyTooltip content="Delete Page">
                    <Trash2
                      onClick={() => {
                        setShow({
                          state: true,
                          type: 'delete-page',
                          data: {
                            id: page?._id,
                            name: page?.name,
                          },
                        });
                      }}
                      className="w-5 h-5 text-red-400 cursor-pointer"
                    />
                  </MyTooltip>
                </div>
              </div>
            ))}

          {!pages?.loading && pages?.data?.length === 0 && (
            <div className="bg-[#202024] rounded-lg p-4 border border-[#2d2d33] shadow-sm">
              <div className="text-sm text-gray-400 bg-[#18181b] p-3 rounded-md uppercase flex justify-center">
                no pages available
              </div>
            </div>
          )}

          {pages?.loading && (
            <div className="hover:bg-[#2a2b30]">
              <div className="w-full px-6 py-4 uppercase text-center font-bold">
                <div className="flex justify-center items-center">
                  <Loader2 className="animate-spin mr-2 w-4 h-4" />
                  loading pages
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Bottom Sheet */}

      <AddPageModal
        onClose={onClose}
        handleAddPage={handleAddPage}
        open={show.state && show.type === 'add-page'}
        loading={loading.type === 'add-page' && loading.state}
      />

      <EditPageModal
        onClose={onClose}
        pageDetails={show?.data?.page}
        handleUpdatePage={handleUpdatePage}
        open={show.state && show.type === 'edit-page'}
        loading={loading.type === 'edit-page' && loading.state}
      />

      <DeleteConfirmationModal
        onClose={onClose}
        onDelete={handleDeletePage}
        msg={`page : ${show?.data?.name}`}
        open={show.state && show.type === 'delete-page'}
        loading={loading.state && loading.type === 'delete-page'}
      />

      <JsonPreviewModal
        onClose={onClose}
        jsonData={show?.data?.json}
        open={show.state && show.type === 'preview-json'}
      />
      <Toaster />
    </>
  );
}

export default Pages;
