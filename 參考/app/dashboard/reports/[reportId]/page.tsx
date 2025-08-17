export default async function ReportDetailPage({
  params,
}: {
  params: Promise<{ reportId: string }>;
}) {
  const { reportId } = await params;
  
  return (
    <div className="report-detail-page">
      <h1>Report Details</h1>
      <div>Report ID: {reportId}</div>
      <div>Report detail content will be implemented here</div>
    </div>
  );
}