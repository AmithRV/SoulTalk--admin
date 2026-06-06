import { handleGetMethod } from '@/lib/api-config/methods';

export default function listVisitor() {
  return handleGetMethod(`/visitors/list-visitors`);
}
