
import SavedEmailLists from './components/SavedEmailLists';
import Link from 'next/link';

export default function EmailListPage() {
  return (
    <div className='flex flex-col gap-2'>
      <div className='flex gap-2 flex-wrap'>
      <Link href="/auto-campaign/manage-lists/create-list-automatically">
          <button className="px-4 py-2 bg-green-600 text-white rounded hover:bg-orange-600">
            Create List Automatically
          </button>
        </Link>
        <Link href="/auto-campaign/manage-lists/create-list-manually">
          <button className="px-4 py-2 bg-green-200 text-slate-500 rounded hover:bg-orange-600">
            Create List Manually
          </button>
        </Link>
        
      </div>

      <SavedEmailLists />
    </div>
  );
}
