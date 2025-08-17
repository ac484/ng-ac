export default async function KnowledgeArticlePage({
  params,
}: {
  params: Promise<{ articleId: string }>;
}) {
  const { articleId } = await params;
  
  return (
    <div className="knowledge-article-page">
      <h1>Knowledge Article</h1>
      <div>Article ID: {articleId}</div>
      <div>Knowledge article content will be implemented here</div>
    </div>
  );
}