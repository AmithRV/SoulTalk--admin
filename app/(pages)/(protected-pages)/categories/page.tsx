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
  AddCategoryModal,
  EditCategoryModal,
} from '@/components/modals/category';
import {
  addCategory,
  deleteCategory,
  updateCategory,
  listCategories,
} from '@/lib/api-collection/categories';
import { useEffect, useState } from 'react';
import { TopBar } from '@/components/layout';
import toast, { Toaster } from 'react-hot-toast';

function Categories() {
  //
  const [loading, setLoading] = useState({ type: '', state: false });
  const [show, setShow] = useState<show>({ state: false, type: '' });
  const [categories, setCategories] = useState({ loading: true, data: [] });

  const onClose = () => {
    setShow({ state: false, type: '' });
  };

  const handleListCategories = () => {
    setCategories((prev) => ({
      ...prev,
      loading: true,
    }));
    listCategories()
      .then((res) => {
        setCategories({ data: res.data, loading: false });
      })
      .catch((error: any) => {
        //
        const defaultMsg = 'Something went wrong';
        const message = error?.response?.data?.message;

        toast.error(message || defaultMsg);
        setCategories({ data: [], loading: false });
      });
  };

  const handleAddCategory = (formData: any) => {
    setLoading({ type: 'add-category', state: true });
    addCategory(formData)
      .then((res) => {
        setCategories((prev: any) => ({
          ...prev,
          data: [res.category, ...prev.data],
          state: false,
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
        setLoading({ type: 'add-category', state: false });
      });
  };

  const handleDeleteCategory = () => {
    const categoryId = show?.data?.id;
    setLoading({ type: 'delete-category', state: true });
    deleteCategory(categoryId)
      .then((res) => {
        setCategories((prev) => ({
          ...prev,
          data: prev.data.filter((page: any) => page._id !== categoryId),
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
        setLoading({ type: 'delete-category', state: false });
      });
  };

  const handleUpdateCategory = (formData: any) => {
    setLoading({ type: 'edit-category', state: true });
    updateCategory(formData)
      .then((res) => {
        setCategories((prev: any) => ({
          ...prev,
          data: prev.data.map((category: any) =>
            category._id == formData.id ? res?.category : category,
          ),
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
        setLoading({ type: 'edit-category', state: false });
      });
  };

  const handleRefresh = () => {
    handleListCategories();
  };

  useEffect(() => {
    handleRefresh();
  }, []);

  return (
    <>
      <main className="flex-1 flex-col  hidden md:flex">
        <TopBar
          label={`Categories (${categories?.data?.length || 0})`}
          setShow={setShow}
          btnlabel="Add Category"
          actionType="add-category"
          handleRefresh={handleRefresh}
          loading={categories?.loading}
        />
        <p className="pl-4 pt-4 text-purple-600 font-semibold">
          Total categories : {categories?.data?.length}
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
                    <th className="px-6 py-3 cursor-pointer">Pages</th>
                    <th className="px-6 py-3">Comments</th>
                    <th className="px-6 py-3 cursor-pointer">Created At</th>
                    <th className="px-6 py-3 cursor-pointer">Updated At</th>
                    <th className="px-6 py-3">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-700">
                  {!categories?.loading &&
                    categories?.data?.length > 0 &&
                    categories?.data.map((category: any, index) => (
                      <tr key={category?._id} className="hover:bg-[#2a2b30]">
                        <td className="px-6 py-4 w-12.5">{index + 1}</td>
                        <td className="px-6 py-4 ">
                          <Link
                            className="border-b border-dotted"
                            href={`/categories/${category?._id}`}
                          >
                            {category?.name}
                          </Link>
                        </td>
                        <td className="px-6 py-4">{category?.views}</td>
                        <td className="px-6 py-4">{category?.comments || 0}</td>

                        <td className="px-6 py-4">
                          {moment(category?.createdAt).format(
                            'DD-MMM-YY hh:mm A',
                          )}
                        </td>
                        <td className="px-6 py-4">
                          {moment(category?.updatedAt).format(
                            'DD-MMM-YY hh:mm A',
                          )}
                        </td>
                        <td className="px-6 py-4 text-green-400 flex items-center gap-4">
                          <MyTooltip content="Edit Category">
                            <Edit
                              onClick={() => {
                                setShow({
                                  state: true,
                                  type: 'edit-category',
                                  data: {
                                    id: category?._id,
                                    name: category?.name,
                                    category,
                                  },
                                });
                              }}
                              className="w-5 h-5 text-gray-400 cursor-pointer"
                            />
                          </MyTooltip>

                          <MyTooltip content="View Category Details">
                            <SquareTerminal
                              onClick={() => {
                                setShow({
                                  state: true,
                                  type: 'preview-json',
                                  data: {
                                    json: category,
                                  },
                                });
                              }}
                              className="w-5 h-5 text-gray-400 ursor-pointer cursor-pointer"
                            />
                          </MyTooltip>

                          <MyTooltip content="Delete Category">
                            <Trash2
                              onClick={() => {
                                setShow({
                                  state: true,
                                  type: 'delete-category',
                                  data: {
                                    id: category?._id,
                                    name: category?.name,
                                  },
                                });
                              }}
                              className="w-5 h-5 text-red-400 cursor-pointer"
                            />
                          </MyTooltip>
                        </td>
                      </tr>
                    ))}

                  {!categories?.loading && categories?.data?.length === 0 && (
                    <tr className="hover:bg-[#2a2b30]">
                      <td
                        className="px-6 py-4 uppercase text-center font-bold"
                        colSpan={7}
                      >
                        no categories available
                      </td>
                    </tr>
                  )}

                  {categories?.loading && (
                    <tr className="hover:bg-[#2a2b30]">
                      <td
                        className="w-full px-6 py-4 uppercase text-center font-bold"
                        colSpan={7}
                      >
                        <div className="flex justify-center items-center">
                          <Loader2 className="animate-spin mr-2 w-4 h-4" />
                          loading categories
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
            Categories ({categories?.data?.length || 0})
          </h1>

          <div className="flex gap-3">
            <button
              onClick={() => {
                setShow({ type: 'add-category', state: true });
              }}
              className="bg-[#9333ea] hover:bg-purple-600 text-white px-4 py-2.5 rounded-md font-medium text-sm flex-1 shadow-sm transition-colors cursor-pointer"
            >
              Add Category
            </button>
            <button
              onClick={handleRefresh}
              className="bg-[#2563eb] hover:bg-blue-600 text-white px-4 py-2.5 rounded-md font-medium text-sm flex items-center justify-center gap-2 flex-1 shadow-sm transition-colors cursor-pointer"
            >
              <RefreshCcw
                className={cn('w-4 h-4 mr-1', {
                  'animate-spin': categories?.loading,
                })}
              />
              Refresh
            </button>
          </div>
        </div>

        <div className="text-[#a855f7] font-medium mb-4 text-sm tracking-wide">
          Total categories : {categories?.data?.length}{' '}
        </div>

        <div className="flex flex-col gap-4">
          {!categories?.loading &&
            categories?.data?.length > 0 &&
            categories?.data.map((category: any, index) => (
              <div
                key={index}
                className="bg-[#202024] rounded-lg p-4 border border-[#2d2d33] shadow-sm"
              >
                <div className="flex justify-between items-start mb-3">
                  <h2 className="text-base text-gray-100 dashed-underline leading-tight pr-4">
                    <Link
                      className="border-b border-dotted"
                      href={`/categories/${category?._id}`}
                    >
                      {category?.name}
                    </Link>
                  </h2>
                  <span className="text-xs font-mono text-gray-400 bg-[#2d2d33] px-2 py-1 rounded">
                    #{index + 1}
                  </span>
                </div>

                <div className="flex gap-6 text-sm text-gray-400 mb-4 bg-[#18181b] p-3 rounded-md">
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                      Pages
                    </span>
                    <span className="text-gray-200 font-medium text-base">
                      0
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs text-gray-400 mb-4">
                  <div>
                    <span className="block text-gray-500 mb-1">Created At</span>
                    <span className="text-gray-300">
                      {moment(category?.createdAt).format('DD-MMM-YY hh:mm A')}
                    </span>
                  </div>
                  <div>
                    <span className="block text-gray-500 mb-1">Updated At</span>
                    <span className="text-gray-300">
                      {moment(category?.updatedAt).format('DD-MMM-YY hh:mm A')}
                    </span>
                  </div>
                </div>

                <div className="flex gap-5 pt-3 border-t border-[#2d2d33] justify-end text-gray-400 text-lg">
                  <MyTooltip content="Edit Category">
                    <Edit
                      onClick={() => {
                        setShow({
                          state: true,
                          type: 'edit-category',
                          data: {
                            id: category?._id,
                            name: category?.name,
                            category,
                          },
                        });
                      }}
                      className="w-5 h-5 text-gray-400 cursor-pointer"
                    />
                  </MyTooltip>

                  <MyTooltip content="View Category Details">
                    <SquareTerminal
                      onClick={() => {
                        setShow({
                          state: true,
                          type: 'preview-json',
                          data: {
                            json: category,
                          },
                        });
                      }}
                      className="w-5 h-5 text-gray-400 ursor-pointer cursor-pointer"
                    />
                  </MyTooltip>

                  <MyTooltip content="Delete Category">
                    <Trash2
                      onClick={() => {
                        setShow({
                          state: true,
                          type: 'delete-category',
                          data: {
                            id: category?._id,
                            name: category?.name,
                          },
                        });
                      }}
                      className="w-5 h-5 text-red-400 cursor-pointer"
                    />
                  </MyTooltip>
                </div>
              </div>
            ))}

          {!categories?.loading && categories?.data?.length === 0 && (
            <div className="bg-[#202024] rounded-lg p-4 border border-[#2d2d33] shadow-sm">
              <div className="text-sm text-gray-400 bg-[#18181b] p-3 rounded-md uppercase flex justify-center">
                no categories available
              </div>
            </div>
          )}

          {categories?.loading && (
            <div className="hover:bg-[#2a2b30]">
              <div className="w-full px-6 py-4 uppercase text-center font-bold">
                <div className="flex justify-center items-center">
                  <Loader2 className="animate-spin mr-2 w-4 h-4" />
                  loading categories
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Bottom Sheet */}

      <AddCategoryModal
        onClose={onClose}
        handleAddCategory={handleAddCategory}
        open={show.state && show.type === 'add-category'}
        loading={loading.type === 'add-category' && loading.state}
      />

      <EditCategoryModal
        onClose={onClose}
        categoryDetails={show?.data?.category}
        handleUpdateCategory={handleUpdateCategory}
        open={show.state && show.type === 'edit-category'}
        loading={loading.type === 'edit-category' && loading.state}
      />

      <DeleteConfirmationModal
        onClose={onClose}
        onDelete={handleDeleteCategory}
        msg={`Category : ${show?.data?.name}`}
        open={show.state && show.type === 'delete-category'}
        loading={loading.state && loading.type === 'delete-category'}
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

export default Categories;
