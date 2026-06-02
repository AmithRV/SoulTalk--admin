import { handlePatchMethod } from '@/lib/api-config/methods';

export default function updateComment(data: any) {
  return handlePatchMethod('/comments/update-comment', data);
}
