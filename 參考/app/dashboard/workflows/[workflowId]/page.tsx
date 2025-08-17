export default async function WorkflowDetailPage({
  params,
}: {
  params: Promise<{ workflowId: string }>;
}) {
  const { workflowId } = await params;
  
  return (
    <div className="workflow-detail-page">
      <h1>Workflow Details</h1>
      <div>Workflow ID: {workflowId}</div>
      <div>Workflow detail content will be implemented here</div>
    </div>
  );
}