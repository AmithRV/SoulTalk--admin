import { cn } from '@/lib/utils';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';

type Inputs = {
  name: string;
};

type props = {
  onClose: () => void;
  handleAddCategory: (formData: Inputs) => void;
  open: boolean;
  loading: boolean;
};

function AddCategoryModal({
  onClose,
  handleAddCategory,
  open,
  loading,
}: props) {
  //
  const {
    reset,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const onSubmit = (formData: Inputs) => {
    handleAddCategory(formData);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  useEffect(() => {
    if (!open) {
      reset();
    }
  }, [open, reset]);

  if (open) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-[#17181c] rounded-lg w-full max-w-md p-6">
          <h2 className="text-lg mb-4">Add Category</h2>

          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            {/* Name */}
            <div>
              <label className="text-sm text-gray-400">Name</label>
              <input
                autoFocus
                type="text"
                className={cn(
                  'w-full mt-1 bg-[#2a2b30] p-2 rounded outline-none',
                  {
                    'input-error': errors.name,
                  },
                )}
                placeholder="Category name"
                {...register('name', { required: '*name is required' })}
              />
              {errors.name && (
                <span className="form-error">{errors.name.message}</span>
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
                disabled={loading}
                type="submit"
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
