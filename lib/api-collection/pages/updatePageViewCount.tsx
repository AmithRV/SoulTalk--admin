import { handlePatchMethod } from '@/lib/api-config/methods';

export default function updatePageViewCount(data: any) {
  return handlePatchMethod('/pages/update-views', data);
}
