'use client';
import {
  Edit,
  Trash2,
  Loader2,
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

  const handleListPages = () => {
    setPages({ loading: true, data: [] });
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
        setLoading({ type: 'add-page', state: false });
      });
  };

  const handleDeletePage = () => {
    const pageId = show?.data?.id;
    setLoading({ type: 'delete-page', state: true });
    deletePage(pageId)
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
    handleListPages();
  }, []);

  return (
    <>
      <main className="flex-1 flex flex-col">
        <TopBar
          label="Pages"
          setShow={setShow}
          btnlabel="Add Page"
          actionType="add-page"
          handleRefresh={handleRefresh}
          loading={pages?.loading}
        />

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
                    <th className="px-6 py-3">Views</th>
                    <th className="px-6 py-3">Created At</th>
                    <th className="px-6 py-3">Updated At</th>
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
