'use client';
import moment from 'moment';
import {
  MyTooltip,
  JsonPreviewModal,
  DeleteConfirmationModal,
} from '@/components/modals';
import { show } from '@/types/show';
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
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { getPage } from '@/lib/api-collection/pages';
import { Edit, SquareTerminal, Trash2 } from 'lucide-react';

function PageDetails() {
  //
  const { id } = useParams();

  const [pageDetails, setPageDetails] = useState<{
    data: any;
    loading: boolean;
  }>({ data: {}, loading: false });
  const [show, setShow] = useState<show>({ state: false, type: '' });
  const [loading, setLoading] = useState({ type: '', state: false });
  const [comments, setComments] = useState({ loading: true, data: [] });

  const onClose = () => {
    setShow({ state: false, type: '' });
  };

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

  const handleListComments = () => {
    setComments({ loading: true, data: [] });
    listComments(id)
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

  useEffect(() => {
    handleListComments();
    handleGetPageDetails();
  }, []);

  return (
    <>
      <div className="w-full flex flex-col bg-black text-[#ededed] font-sans">
        {/* Top Navigation */}
        <header className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-black sticky md:top-0 z-10 top-18 ">
          <div className="flex items-center gap-3 text-sm text-neutral-200 font-medium">
            <span className="font-semibold text-[18px] text-white">
              {pageDetails?.data?.name}
            </span>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-6 md:p-8 max-w-6xl w-full mt-20 md:mx-auto md:mt-0">
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
              <div className="w-full border border-neutral-800 rounded-lg  bg-[#0a0a0a]">
                <img
                  src={`https://soultalk.blog/public/assets/${pageDetails?.data?.imageName}`}
                  alt="Thumbnail"
                  className="w-full h-full object-fill"
                />
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

            {/* comments */}
            <div className="p-5 border-t border-neutral-800">
              <div className="w-full flex justify-between items-center">
                <h2 className="text-base font-semibold text-white flex items-center">
                  Comments :{' '}
                  <span className="ml-1 pt-0.5">{comments?.data?.length}</span>
                </h2>
                <button
                  onClick={() => {
                    setShow({ type: 'add-comment', state: true });
                  }}
                  className="bg-purple-600 hover:bg-purple-700 px-4 py-1 rounded-full text-sm font-bold cursor-pointer"
                >
                  Add Comment
                </button>
              </div>

              <div className="space-y-6 mt-4">
                {/* <!-- Comment --> */}
                {comments?.data.map((comment: any) => (
                  <div
                    key={comment?._id}
                    className="bg-brand-surface border border-gray-800/60 p-5 rounded-2xl"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-purple-900/50 border border-brand-accent/30 flex items-center justify-center text-xs font-bold text-brand-accent uppercase">
                          {comment?.name
                            .trim()
                            .split(/\s+/)
                            .map((w: string) => w.charAt(0))
                            .join('')}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-white text-sm">
                            {comment?.name}
                          </span>
                          <span className="text-xs text-gray-500">
                            {moment(comment?.createdAt).fromNow()}
                          </span>
                        </div>
                      </div>
                      <div className="px-6 py-4 text-green-400 flex items-center gap-4">
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
                      </div>
                    </div>
                    <p className="text-gray-300 text-sm leading-relaxed font-sans pl-1">
                      {comment?.comment}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>

      <AddCommentModal
        onClose={onClose}
        pages={[pageDetails?.data]}
        pageId={pageDetails?.data?._id}
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

export default PageDetails;
