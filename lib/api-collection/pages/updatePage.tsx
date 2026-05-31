import { handlePatchMethod } from '@/lib/api-config/methods';

export default function updatePage(data: any) {
  return handlePatchMethod('/pages/update-page', data);
}
