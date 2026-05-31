import { handleGetMethod } from '@/lib/api-config/methods';

export default function logout() {
  return handleGetMethod('/auth/logout');
}
