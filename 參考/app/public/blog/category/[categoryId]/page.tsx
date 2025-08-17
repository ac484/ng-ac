export default async function BlogCategoryPage({
  params,
}: {
  params: Promise<{ categoryId: string }>;
}) {
  const { categoryId } = await params;
  
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">文章分類</h1>
      <p>分類：{categoryId}</p>
      <p>分類文章列表功能開發中...</p>
    </div>
  );
}