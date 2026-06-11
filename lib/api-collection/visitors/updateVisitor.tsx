import { handlePatchMethod } from '@/lib/api-config/methods';

export default function updateVisitor(data: any) {
  return handlePatchMethod('/visitors/update-visitor', data);
}
