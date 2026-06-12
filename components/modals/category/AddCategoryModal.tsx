import { cn } from '@/lib/utils';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

type Inputs = {
  path: string;
  name: string;
  description: string;
};

type props = {
  open: boolean;
  loading: boolean;
  onClose: () => void;
  handleAddCategory: (formData: any) => void;
};
function AddCategoryModal({
  open,
  onClose,
  handleAddCategory,
  loading = false,
}: props) {
  //

  const {
    reset,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const onSubmit = (formData: Inputs) => {
    const data = {
      name: formData?.name,
      path: formData?.path,
      description: formData?.description,
    };
    handleAddCategory(data);
  };

  const handleClose = () => {
    onClose();
  };

  useEffect(() => {
    if (!open) {
      reset();
    }
  }, [open, reset]);

  if (open) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 ">
        <div className="bg-[#17181c] rounded-lg w-full max-w-md p-6 max-h-screen overflow-y-auto">
          <h2 className="text-lg mb-4">Add Category</h2>

          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
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

            {/* Path */}
            <div>
              <label className="text-sm text-gray-400">Path</label>
              <input
                type="text"
                placeholder="Enter path"
                {...register('path', {
                  required: '*path is required',
                })}
                className={cn(
                  'w-full mt-1 bg-[#2a2b30] p-2 rounded outline-none',
                  {
                    'input-error': errors.path,
                  },
                )}
              />{' '}
              {errors.path && (
                <span className="form-error">{errors.path.message}</span>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="text-sm text-gray-400">Description</label>
              <textarea
                rows={4}
                placeholder="Enter description"
                {...register('description')}
                className="w-full mt-1 bg-[#2a2b30] p-2 rounded outline-none resize-none"
              />{' '}
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

export default AddCategoryModal;
