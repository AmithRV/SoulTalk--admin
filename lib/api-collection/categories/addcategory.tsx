import { handlePostMethod } from '@/lib/api-config/methods';

export default function addcategory(data: any) {
  return handlePostMethod('/categories/add-category', data);
}
