export default async function EmployeeDetailPage({
  params,
}: {
  params: Promise<{ employeeId: string }>;
}) {
  const { employeeId } = await params;
  
  return (
    <div className="employee-detail-page">
      <h1>Employee Details</h1>
      <div>Employee ID: {employeeId}</div>
      <div>Employee detail content will be implemented here</div>
    </div>
  );
}