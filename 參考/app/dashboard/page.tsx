import ClientOnly from '@/components/ClientOnly';
import { useFirebase } from '@/hooks/useFirebase';

function DashboardContent() {
  const { isInitialized } = useFirebase();

  if (!isInitialized) {
    return <div>Loading Firebase...</div>;
  }

  return (
    <div>
      {/* Your dashboard content that uses Firebase */}
    </div>
  );
}

export default function DashboardPage() {
  return (
    <ClientOnly fallback={<div>Loading...</div>}>
      <DashboardContent />
    </ClientOnly>
  );
}
