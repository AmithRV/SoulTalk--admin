'use client';
import moment from 'moment';
import Link from 'next/link';
import {
  MyTooltip,
  JsonPreviewModal,
  DeleteConfirmationModal,
} from '@/components/modals';
import { show } from '@/types/index';
import {
  AddCommentModal,
  EditCommentModal,
} from '@/components/modals/comments';
import {
  addComment,
  listComments,
  deleteComment,
  updateComment,
} from '@/lib/api-collection/comments';
import { useEffect, useState } from 'react';
import { TopBar } from '@/components/layout';
import toast, { Toaster } from 'react-hot-toast';
import { listPages } from '@/lib/api-collection/pages';
import { Edit, Trash2, Loader2, SquareTerminal } from 'lucide-react';

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

  const handleListComments = () => {
    setComments({ loading: true, data: [] });
    listComments()
      .then((res) => {
        setComments({ data: res.data, loading: false });
      })
      .catch((error: any) => {
        //
        const defaultMsg = 'Something went wrong';
        const message = error?.response?.data?.message;

        toast.error(message || defaultMsg);
        setComments({ data: [], loading: false });
      });
  };

  const handleAddComment = (formData: any) => {
    setLoading({ type: 'add-comment', state: true });
    addComment(formData)
      .then((res) => {
        handleListComments();
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
        setLoading({ type: 'add-comment', state: false });
      });
  };

  const handleDeleteComment = () => {
    const pageId = show?.data?.id;
    setLoading({ type: 'delete-comment', state: true });
    deleteComment(pageId)
      .then((res) => {
        handleListComments();
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
        setLoading({ type: 'delete-comment', state: false });
      });
  };

  const handleUpdateComment = (formData: any) => {
    setLoading({ type: 'edit-comment', state: true });
    updateComment(formData)
      .then((res) => {
        handleListComments();
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
        setLoading({ type: 'edit-comment', state: false });
      });
  };

  const handleRefresh = () => {
    handleListPages();
    handleListComments();
  };

  useEffect(() => {
    handleListPages();
    handleListComments();
  }, []);

  return (
    <>
      <main className="flex-1 flex flex-col">
        <TopBar
          label={`Comments (${comments?.data?.length || 0})`}
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
                    <th className="px-6 py-3 cursor-pointer">page</th>
                    <th className="px-6 py-3">Name</th>
                    <th className="px-6 py-3 cursor-pointer">Comment</th>
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
                        <td className="px-6 py-4 w-12.5">
                          {comment?.page?.name}
                        </td>
                        <td className="px-6 py-4 ">
                          <Link
                            className="border-b border-dotted"
                            href={`/pages/${comment?._id}`}
                          >
                            {comment?.name}
                          </Link>
                        </td>
                        <td className="px-6 py-4">{comment?.comment}</td>

                        <td className="px-6 py-4">
                          {moment(comment?.createdAt).format(
                            'DD-MMM-YY hh:mm A',
                          )}
                        </td>

                        <td className="px-6 py-4 text-green-400 flex items-center gap-4">
                          <MyTooltip content="Edit Comment">
                            <Edit
                              onClick={() => {
                                setShow({
                                  state: true,
                                  type: 'edit-comment',
                                  data: {
                                    comment,
                                  },
                                });
                              }}
                              className="w-5 h-5 text-gray-400 cursor-pointer"
                            />
                          </MyTooltip>

                          <MyTooltip content="View Comment Details">
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

                          <MyTooltip content="Delete Comment">
                            <Trash2
                              onClick={() => {
                                setShow({
                                  state: true,
                                  type: 'delete-comment',
                                  data: {
                                    id: comment?._id,
                                    comment: comment?.comment,
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
                        no comments available
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
                          loading comments
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
        pages={pages?.data}
        handleAddComment={handleAddComment}
        open={show.state && show.type === 'add-comment'}
        loading={loading.type === 'add-comment' && loading.state}
      />

      <EditCommentModal
        onClose={onClose}
        commentDetails={show?.data?.comment}
        handleUpdateComment={handleUpdateComment}
        open={show.state && show.type === 'edit-comment'}
        loading={loading.type === 'edit-comment' && loading.state}
      />

      <DeleteConfirmationModal
        onClose={onClose}
        onDelete={handleDeleteComment}
        msg={`Comment : ${show?.data?.name}`}
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
