import { handleGetMethod } from '@/lib/api-config/methods';

export default function listPages() {
  return handleGetMethod(`/views/list-views`);
}
