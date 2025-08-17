export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">文章內容</h1>
      <p>文章：{slug}</p>
      <p>文章內容功能開發中...</p>
    </div>
  );
}