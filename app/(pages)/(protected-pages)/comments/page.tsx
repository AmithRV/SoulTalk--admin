'use client';
import {
  Edit,
  Trash2,
  Loader2,
  RefreshCcw,
  SquareTerminal,
} from 'lucide-react';
import moment from 'moment';
import Link from 'next/link';
import {
  MyTooltip,
  JsonPreviewModal,
  DeleteConfirmationModal,
} from '@/components/modals';
import { cn } from '@/lib/utils';
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
      <main className="flex-1 md:flex flex-col hidden">
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

      <main className="flex-1 p-4 px-0 max-w-lg mx-auto w-full overflow-y-auto flex md:hidden flex-col mt-16">
        <div className="flex flex-col gap-4 mb-6">
          <h1 className="text-2xl font-medium text-white">
            Comments ({comments?.data?.length || 0})
          </h1>

          <div className="flex gap-3">
            <button
              onClick={() => {
                setShow({ type: 'add-comment', state: true });
              }}
              className="bg-[#9333ea] hover:bg-purple-600 text-white px-4 py-2.5 rounded-md font-medium text-sm flex-1 shadow-sm transition-colors cursor-pointer"
            >
              Add comment
            </button>
            <button
              onClick={handleRefresh}
              className="bg-[#2563eb] hover:bg-blue-600 text-white px-4 py-2.5 rounded-md font-medium text-sm flex items-center justify-center gap-2 flex-1 shadow-sm transition-colors cursor-pointer"
            >
              <RefreshCcw
                className={cn('w-4 h-4 mr-1', {
                  'animate-spin': comments?.loading,
                })}
              />
              Refresh
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          {!comments?.loading &&
            comments?.data?.length > 0 &&
            comments?.data.map((comment: any, index) => (
              <div
                key={index}
                className="bg-[#202024] rounded-lg p-4 border border-[#2d2d33] shadow-sm"
              >
                <div className="flex justify-between items-start mb-3">
                  <h2 className="text-base text-gray-100 dashed-underline leading-tight pr-4">
                    <p className="font-bold">{comment?.name}</p>
                  </h2>
                  <span className="text-xs font-mono text-gray-400 bg-[#2d2d33] px-2 py-1 rounded">
                    #{index + 1}
                  </span>
                </div>

                <div className="flex gap-6 text-sm text-gray-400 bg-[#18181b] p-3 rounded-md">
                  <div className="flex flex-col">
                    <span className="text-gray-500 tracking-wider mb-1">
                      {comment?.comment}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-gray-400 my-4">
                  Page :
                  <Link
                    className="border-b border-dotted ml-2"
                    href={`/pages/${comment?.page?._id}`}
                  >
                    {comment?.page?.name}
                  </Link>
                </p>

                <div className="grid grid-cols-2 gap-4 text-xs text-gray-400 mb-4">
                  <div>
                    <span className="block text-gray-500 mb-1">Created At</span>
                    <span className="text-gray-300">
                      {moment(comment?.createdAt).format('DD-MMM-YY hh:mm A')}
                    </span>
                  </div>
                  <div>
                    <span className="block text-gray-500 mb-1">Updated At</span>
                    <span className="text-gray-300">
                      {moment(comment?.updatedAt).format('DD-MMM-YY hh:mm A')}
                    </span>
                  </div>
                </div>

                <div className="flex gap-5 pt-3 border-t border-[#2d2d33] justify-end text-gray-400 text-lg">
                  <MyTooltip content="Edit Page">
                    <Edit
                      onClick={() => {
                        setShow({
                          state: true,
                          type: 'edit-comment',
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

                  <MyTooltip content="Delete Page">
                    <Trash2
                      onClick={() => {
                        setShow({
                          state: true,
                          type: 'delete-comment',
                          data: {
                            id: comment?._id,
                            name: comment?.name,
                          },
                        });
                      }}
                      className="w-5 h-5 text-red-400 cursor-pointer"
                    />
                  </MyTooltip>
                </div>
              </div>
            ))}

          {comments?.loading && (
            <div className="hover:bg-[#2a2b30]">
              <div className="w-full px-6 py-4 uppercase text-center font-bold">
                <div className="flex justify-center items-center">
                  <Loader2 className="animate-spin mr-2 w-4 h-4" />
                  loading comments
                </div>
              </div>
            </div>
          )}
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
