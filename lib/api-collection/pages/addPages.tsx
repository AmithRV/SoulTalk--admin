import { handlePostMethod } from '@/lib/api-config/methods';

export default function addPages(data: any) {
  return handlePostMethod('/pages/add-page', data);
}
