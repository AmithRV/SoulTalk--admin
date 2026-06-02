import { handlePostMethod } from '@/lib/api-config/methods';

export default function addComment(data: any) {
  return handlePostMethod('/comments/add-comment', data);
}
