import { handleGetMethod } from '@/lib/api-config/methods';
import { ParamValue } from 'next/dist/server/request/params';

export default function getCategory(id: ParamValue) {
  return handleGetMethod(`/categories/get-category?id=${id}`);
}
