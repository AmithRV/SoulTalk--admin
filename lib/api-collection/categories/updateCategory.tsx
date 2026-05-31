import { handlePatchMethod } from '@/lib/api-config/methods';

export default function updateCategory(data: any) {
  return handlePatchMethod('/categories/update-category', data);
}
