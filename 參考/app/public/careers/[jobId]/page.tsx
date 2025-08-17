export default async function JobDetailPage({
  params,
}: {
  params: Promise<{ jobId: string }>;
}) {
  const { jobId } = await params;
  
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">職缺詳情</h1>
      <p>職缺 ID：{jobId}</p>
      <p>職缺詳細資訊和應徵表單功能開發中...</p>
    </div>
  );
}
