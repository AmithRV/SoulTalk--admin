'use client';

import moment from 'moment';
import {
  MyTooltip,
  JsonPreviewModal,
  DeleteConfirmationModal,
} from '@/components/modals';
import Link from 'next/link';
import { show } from '@/types/show';
import {
  AddCategoryModal,
  EditCategoryModal,
} from '@/components/modals/category';
import {
  addcategory,
  deleteCategory,
  listCategories,
  updateCategory,
} from '@/lib/api-collection/categories';
import { useEffect, useState } from 'react';
import { TopBar } from '@/components/layout';
import toast, { Toaster } from 'react-hot-toast';
import { Edit, Loader2, SquareTerminal, Trash2 } from 'lucide-react';

function Categories() {
  //
  const [show, setShow] = useState<show>({ state: false, type: '' });
  const [loading, setLoading] = useState({ type: '', state: false });
  const [categories, setCategories] = useState({ loading: true, data: [] });

  const handleListCategories = () => {
    setCategories({ loading: true, data: [] });
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
    addcategory(formData)
      .then((res) => {
        handleListCategories();
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
        handleListCategories();
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
        handleListCategories();
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

  const onClose = () => {
    setShow({ state: false, type: '' });
  };

  const handleRefresh = () => {
    handleListCategories();
  };

  useEffect(() => {
    handleListCategories();
  }, []);

  return (
    <>
      <main className="flex-1 flex flex-col">
        {/* <!-- Top bar --> */}
        <TopBar
          setShow={setShow}
          label="Categories"
          btnlabel="Add Category"
          actionType="add-category"
          handleRefresh={handleRefresh}
          loading={categories?.loading}
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
                    <th className="px-6 py-3">Name</th>
                    <th className="px-6 py-3">CreatedAt</th>
                    <th className="px-6 py-3">UpdatedAt</th>
                    <th className="px-6 py-3">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-700">
                  {!categories?.loading &&
                    categories?.data?.length > 0 &&
                    categories?.data?.map((category: any) => (
                      <tr key={category?._id} className="hover:bg-[#2a2b30]">
                        <td className="px-6 py-4">
                          <Link
                            href={`/categories/${category?._id}`}
                            className="border-b border-dotted"
                          >
                            {category?.name}
                          </Link>
                        </td>
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
                        colSpan={4}
                      >
                        no categories available
                      </td>
                    </tr>
                  )}

                  {categories?.loading && (
                    <tr className="hover:bg-[#2a2b30]">
                      <td
                        className="w-full px-6 py-4 uppercase text-center font-bold"
                        colSpan={4}
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

      <AddCategoryModal
        onClose={onClose}
        handleAddCategory={handleAddCategory}
        open={show.state && show.type === 'add-category'}
        loading={loading.state && loading.type === 'add-category'}
      />

      <EditCategoryModal
        onClose={onClose}
        categoryData={show.data}
        handleUpdateCategory={handleUpdateCategory}
        open={show.state && show.type === 'edit-category'}
        loading={loading.state && loading.type === 'edit-category'}
      />

      <DeleteConfirmationModal
        onClose={onClose}
        onDelete={handleDeleteCategory}
        msg={`category : ${show?.data?.name}`}
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
