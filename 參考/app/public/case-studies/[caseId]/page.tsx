
// CaseStudyDetailPage
export default async function CaseStudyDetailPage({
  params,
}: {
  params: Promise<{ caseId: string }>;
}) {
  const { caseId } = await params;
  
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">案例詳情</h1>
      <p>案例 ID：{caseId}</p>
      <p>詳細案例介紹功能開發中...</p>
    </div>
  );
}