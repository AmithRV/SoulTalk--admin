import { handleDeleteMethod } from '@/lib/api-config/methods';

export default function deleteComment(id: any) {
  return handleDeleteMethod(`/comments/delete-comment?id=${id}`);
}
