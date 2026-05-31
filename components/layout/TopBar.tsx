import React from 'react';
import { cn } from '@/lib/utils';
import { RefreshCcw } from 'lucide-react';

function TopBar({
  label,
  loading,
  setShow,
  btnlabel,
  actionType,
  handleRefresh,
}: {
  label: string;
  loading: boolean;
  btnlabel: string;
  actionType: string;
  setShow: React.Dispatch<
    React.SetStateAction<{ state: boolean; type: string }>
  >;
  handleRefresh: () => void;
}) {
  return (
    <div className="flex items-center justify-between px-6 py-4 border-b border-gray-700">
      <h1 className="text-lg font-medium">{label}</h1>
      <div className="flex">
        <button
          onClick={() => {
            setShow({ type: actionType, state: true });
          }}
          className="bg-purple-600 hover:bg-purple-700 px-4 py-1 rounded-full text-sm font-bold cursor-pointer"
        >
          {btnlabel}
        </button>

        <button
          onClick={() => {
            handleRefresh();
          }}
          disabled={loading}
          className="ml-2 bg-blue-500 hover:bg-blue-600 px-2 py-1 rounded-[5px] text-sm font-bold cursor-pointer flex items-center disabled:bg-blue-400"
        >
          <RefreshCcw
            className={cn('w-4 h-4 mr-1', { 'animate-spin': loading })}
          />
          <span>{loading ? 'Refreshing...' : 'Refresh'}</span>
        </button>
      </div>
    </div>
  );
}

export default TopBar;
