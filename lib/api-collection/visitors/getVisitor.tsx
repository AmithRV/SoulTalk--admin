import { handleGetMethod } from '@/lib/api-config/methods';
import { ParamValue } from 'next/dist/server/request/params';

export default function getVisitor(id: ParamValue) {
  return handleGetMethod(`/visitors/get-visitor?id=${id}`);
}
