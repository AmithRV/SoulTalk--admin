import { handleDeleteMethod } from '@/lib/api-config/methods';

export default function deleteVisitor(id: any) {
  return handleDeleteMethod(`/visitors/delete-visitor?id=${id}`);
}
