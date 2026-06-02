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
import { show } from '@/types/index';
import { useEffect, useState } from 'react';
import { TopBar } from '@/components/layout';
import {
  DeleteConfirmationModal,
  JsonPreviewModal,
  MyTooltip,
} from '@/components/modals';
import toast, { Toaster } from 'react-hot-toast';
import { listPages } from '@/lib/api-collection/pages';
import AddCommentModal from '@/components/modals/comments/AddCommentModal';
import EditCommentModal from '@/components/modals/comments/EditCommentModal';

function Pages() {
  //
  const [pages, setPages] = useState({ loading: true, data: [] });
  const [show, setShow] = useState<show>({ state: false, type: '' });
  const [loading, setLoading] = useState({ type: '', state: false });
  const [comments, setComments] = useState({ loading: true, data: [] });

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

  const handleRefresh = () => {
    handleListPages();
  };

  useEffect(() => {
    handleListPages();
  }, []);

  useEffect(() => {
    console.clear();
    console.log('pages : ', pages);
    console.log('comments : ', comments);
  }, [comments, pages]);
  return (
    <>
      <main className="flex-1 flex flex-col">
        <TopBar
          label="Comments"
          setShow={setShow}
          btnlabel="Add Comment"
          actionType="add-comment"
          handleRefresh={handleRefresh}
          loading={comments?.loading}
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
                    <th className="px-6 py-3 cursor-pointer">Views</th>
                    <th className="px-6 py-3 cursor-pointer">Created At</th>
                    <th className="px-6 py-3">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-700">
                  {!comments?.loading &&
                    comments?.data?.length > 0 &&
                    comments?.data.map((comment: any, index) => (
                      <tr key={comment?._id} className="hover:bg-[#2a2b30]">
                        <td className="px-6 py-4 w-12.5">{index + 1}</td>
                        <td className="px-6 py-4 ">
                          <Link
                            className="border-b border-dotted"
                            href={`/pages/${comment?._id}`}
                          >
                            {comment?.name}
                          </Link>
                        </td>
                        <td className="px-6 py-4">{comment?.views}</td>

                        <td className="px-6 py-4">
                          {moment(comment?.createdAt).format(
                            'DD-MMM-YY hh:mm A',
                          )}
                        </td>

                        <td className="px-6 py-4 text-green-400 flex items-center gap-4">
                          <MyTooltip content="Edit Page">
                            <Edit
                              onClick={() => {
                                setShow({
                                  state: true,
                                  type: 'edit-page',
                                  data: {
                                    id: comment?._id,
                                    name: comment?.name,
                                    comment,
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
                                    json: comment,
                                  },
                                });
                              }}
                              className="w-5 h-5 text-gray-400 ursor-pointer cursor-pointer"
                            />
                          </MyTooltip>

                          <MyTooltip content="Open Page">
                            <SquareArrowOutUpRight className="w-5 h-5 text-gray-400 cursor-pointer" />
                          </MyTooltip>

                          <MyTooltip content="Delete Page">
                            <Trash2
                              onClick={() => {
                                setShow({
                                  state: true,
                                  type: 'delete-page',
                                  data: {
                                    id: comment?._id,
                                    name: comment?.name,
                                  },
                                });
                              }}
                              className="w-5 h-5 text-red-400 cursor-pointer"
                            />
                          </MyTooltip>
                        </td>
                      </tr>
                    ))}

                  {!comments?.loading && comments?.data?.length === 0 && (
                    <tr className="hover:bg-[#2a2b30]">
                      <td
                        className="px-6 py-4 uppercase text-center font-bold"
                        colSpan={7}
                      >
                        no pages available
                      </td>
                    </tr>
                  )}

                  {comments?.loading && (
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

      <AddCommentModal
        onClose={onClose}
        handleAddComment={() => {}}
        open={show.state && show.type === 'add-comment'}
        loading={loading.type === 'add-comment' && loading.state}
      />

      <EditCommentModal
        onClose={onClose}
        commentDetails={show?.data?.comment}
        handleUpdateComment={() => {}}
        open={show.state && show.type === 'edit-comment'}
        loading={loading.type === 'edit-comment' && loading.state}
      />

      <DeleteConfirmationModal
        onClose={onClose}
        onDelete={() => {}}
        msg={`page : ${show?.data?.name}`}
        open={show.state && show.type === 'delete-comment'}
        loading={loading.state && loading.type === 'delete-comment'}
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
