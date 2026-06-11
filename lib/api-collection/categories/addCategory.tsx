import { handlePostMethod } from '@/lib/api-config/methods';

export default function addCategory(data: any) {
  return handlePostMethod('/categories/add-category', data);
}
