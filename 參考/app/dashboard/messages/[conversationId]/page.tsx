export default async function ConversationPage({
  params,
}: {
  params: Promise<{ conversationId: string }>;
}) {
  const { conversationId } = await params;
  
  return (
    <div className="conversation-page">
      <h1>Conversation</h1>
      <div>Conversation ID: {conversationId}</div>
      <div>Conversation content will be implemented here</div>
    </div>
  );
}