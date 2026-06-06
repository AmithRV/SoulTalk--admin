import { handleDeleteMethod } from '@/lib/api-config/methods';

export default function deletePage(id: any) {
  return handleDeleteMethod(`/views/delete-view?id=${id}`);
}
