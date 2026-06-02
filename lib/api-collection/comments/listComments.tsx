import { handleGetMethod } from '@/lib/api-config/methods';
import { ParamValue } from 'next/dist/server/request/params';

export default function listComments(id?: ParamValue) {
  return handleGetMethod(`/comments/list-comments?pageId=${id || ''}`);
}
