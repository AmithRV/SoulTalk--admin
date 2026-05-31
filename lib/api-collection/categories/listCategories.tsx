import { handleGetMethod } from '@/lib/api-config/methods';

export default function listCategories() {
  return handleGetMethod('/categories/list-categories');
}
