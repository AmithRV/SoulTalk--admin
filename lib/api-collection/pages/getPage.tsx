import { handleGetMethod } from '@/lib/api-config/methods';
import { ParamValue } from 'next/dist/server/request/params';

export default function getPage(id: ParamValue) {
  return handleGetMethod(`/pages/get-page?id=${id}`);
}
