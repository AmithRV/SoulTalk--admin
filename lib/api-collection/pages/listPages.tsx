import { handleGetMethod } from '@/lib/api-config/methods';
import { ParamValue } from 'next/dist/server/request/params';

export default function listPages(id?: ParamValue, categoryId?: ParamValue) {
  return handleGetMethod(
    `/pages/list-pages?id=${id || ''}&categoryId=${categoryId || ''}`,
  );
}
