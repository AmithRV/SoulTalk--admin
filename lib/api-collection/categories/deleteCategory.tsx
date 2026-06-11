import { handleDeleteMethod } from '@/lib/api-config/methods';

export default function deleteCategory(id: any) {
  return handleDeleteMethod(`/categories/delete-category?id=${id}`);
}
