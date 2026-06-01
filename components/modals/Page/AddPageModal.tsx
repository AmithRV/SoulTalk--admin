/* eslint-disable react-hooks/incompatible-library */
import { cn } from '@/lib/utils';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

type Inputs = {
  url: string;
  name: string;
  imageName: string;
  publicUrl: string;
  description: string;
};

type props = {
  open: boolean;
  loading: boolean;
  onClose: () => void;
  handleAddPage: (formData: any) => void;
};
function AddPageModal({
  open,
  onClose,
  handleAddPage,
  loading = false,
}: props) {
  //

  const {
    reset,
    watch,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const pageName = watch('name');

  const onSubmit = (formData: Inputs) => {
    const data = {
      url: formData?.url,
      name: formData?.name,
      publicUrl: formData?.publicUrl,
      imageName: formData?.imageName,
      description: formData?.description,
    };
    handleAddPage(data);
  };

  const handleClose = () => {
    onClose();
  };

  function createUrlSlug(name: string) {
    if (name) {
      return name
        .trim() // Removes spaces at the very beginning or end
        .toLowerCase() // Converts everything to lowercase
        .replace(/\s+/g, '-') // Replaces all spaces with hyphens
        .replace(/"/g, '')
        .replace(/,/g, '')
        .replace(/'/g, '')
        .replace(/:/g, ''); // Removes all colons
    }
    return '';
  }

  useEffect(() => {
    if (!open) {
      reset();
    }
  }, [open, reset]);

  if (open) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 ">
        <div className="bg-[#17181c] rounded-lg w-[50%] p-6 max-h-screen overflow-y-auto">
          <h2 className="text-lg mb-4">Add Page</h2>

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

            {/* URL */}
            <div>
              <label className="text-sm text-gray-400">URL</label>
              <input
                type="text"
                placeholder="Enter URL"
                {...register('url', {
                  required: '*url is required',
                })}
                className={cn(
                  'w-full mt-1 bg-[#2a2b30] p-2 rounded outline-none',
                  {
                    'input-error': errors.url,
                  },
                )}
              />
              {errors.url && (
                <span className="form-error">{errors.url.message}</span>
              )}
              <span className="text-gray-400">{createUrlSlug(pageName)}</span>
            </div>

            {/*Public URL */}
            <div>
              <label className="text-sm text-gray-400">Public URL</label>
              <input
                type="text"
                placeholder="Enter URL"
                {...register('publicUrl', {
                  required: '*public url is required',
                })}
                className={cn(
                  'w-full mt-1 bg-[#2a2b30] p-2 rounded outline-none',
                  {
                    'input-error': errors.publicUrl,
                  },
                )}
              />
              {errors.publicUrl && (
                <span className="form-error">{errors.publicUrl.message}</span>
              )}
            </div>

            {/*Image name */}
            <div>
              <label className="text-sm text-gray-400">Image Name</label>
              <input
                type="text"
                placeholder="image.png"
                {...register('imageName', {
                  required: '*image name is required',
                })}
                className={cn(
                  'w-full mt-1 bg-[#2a2b30] p-2 rounded outline-none',
                  {
                    'input-error': errors.imageName,
                  },
                )}
              />
              {errors.imageName && (
                <span className="form-error">{errors.imageName.message}</span>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="text-sm text-gray-400">Description</label>
              <textarea
                rows={4}
                placeholder="Enter description"
                {...register('description', {
                  required: '*description is required',
                })}
                className={cn(
                  'w-full mt-1 bg-[#2a2b30] p-2 rounded outline-none resize-none',
                  {
                    'input-error': errors.description,
                  },
                )}
              />{' '}
              {errors.description && (
                <span className="form-error">{errors.description.message}</span>
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

export default AddPageModal;
