import EmailListsManager from './components/EmailListsManager';
import SavedEmailLists from './components/SavedEmailLists';

export default function EmailListPage() {
  return (
    <div>
      <EmailListsManager />
      <SavedEmailLists />
    </div>
  );
}