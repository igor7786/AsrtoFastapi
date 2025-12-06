import { Spinner } from '@/components/reactcomp/spinner';
import { getQueryClient } from '@/lib/tan-stack/tanstack-query';
import { toast } from 'sonner';
import { Check, X } from 'lucide-react';

export default function LogoutButton() {
  const queryClient = getQueryClient();

  const handleLogout = () => {
    queryClient.clear();
  };

  return (
    <button
      type="submit"
      onClick={handleLogout}
      disabled={false}
      className="text-sm text-green-500 hover:underline disabled:opacity-50 dark:text-green-400"
    >
      Logout
    </button>
  );
}
