import { cn } from '@/lib/utils';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

type Inputs = {
  name: string;
  pageId: string;
  comment: string;
};

type props = {
  pages: any[];
  open: boolean;
  pageId?: string;
  loading: boolean;
  onClose: () => void;
  handleAddComment: (formData: any) => void;
};

function AddCommentModal({
  open,
  onClose,
  pageId = '',
  pages = [],
  handleAddComment,
  loading = false,
}: props) {
  //
  const {
    reset,
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({
    defaultValues: {
      name: '',
      pageId: pageId || '',
      comment: '',
    },
  });

  const onSubmit = (formData: Inputs) => {
    const data = {
      name: formData?.name,
      pageId: formData?.pageId,
      comment: formData?.comment,
    };
    handleAddComment(data);
  };

  const handleClose = () => {
    onClose();
  };

  useEffect(() => {
    if (!open) {
      reset();
    }
    if (open && pages?.length > 0 && pageId) {
      setValue('pageId', pageId, {
        shouldValidate: true,
      });
    }
  }, [open, pages, pageId, reset]);

  if (open) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-hidden">
        <div className="bg-[#17181c] rounded-lg p-6 max-h-screen overflow-y-auto">
          <h2 className="text-lg mb-4">Add Comment</h2>

          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            {/* Name */}
            <div>
              <label className="text-sm text-gray-400">Page</label>
              <select
                {...register('pageId', {
                  required: '*page is required',
                })}
                className={cn(
                  'w-full mt-1 bg-[#2a2b30] p-2 rounded outline-none cursor-pointer',
                  {
                    'input-error': errors.pageId,
                    'cursor-not-allowed': pageId,
                  },
                )}
                defaultValue=""
                disabled={pageId ? true : false}
              >
                <option value="" disabled>
                  Select a page
                </option>
                {pages?.map((page) => (
                  <option
                    key={page?._id}
                    value={page?._id}
                    className="cursor-pointer"
                  >
                    {page?.name}
                  </option>
                ))}
              </select>

              {errors.pageId && (
                <span className="form-error">{errors.pageId.message}</span>
              )}
            </div>

            {/* Name */}
            <div>
              <label className="text-sm text-gray-400">Name</label>
              <input
                type="text"
                placeholder="Enter name"
                {...register('name', {
                  required: '*name is required',
                })}
                className={cn(
                  'w-full mt-1 bg-[#2a2b30] p-2 rounded outline-none',
                  {
                    'input-error': errors.name,
                  },
                )}
              />{' '}
              {errors.name && (
                <span className="form-error">{errors.name.message}</span>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="text-sm text-gray-400">Description</label>
              <textarea
                rows={4}
                placeholder="Enter description"
                {...register('comment', {
                  required: '*comment is required',
                })}
                className={cn(
                  'w-full mt-1 bg-[#2a2b30] p-2 rounded outline-none resize-none',
                  {
                    'input-error': errors.comment,
                  },
                )}
              />{' '}
              {errors.comment && (
                <span className="form-error">{errors.comment.message}</span>
              )}
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={handleClose}
                type="button"
                className="px-4 py-2 bg-gray-600 rounded cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-purple-600 rounded hover:bg-purple-700 cursor-pointer"
              >
                {loading ? 'Saving...' : 'Save'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }
  return null;
}

export default AddCommentModal;
