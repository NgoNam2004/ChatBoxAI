// Placeholder for the real AI Coach backend integration.
// useChatMessages() currently mocks replies locally; once an API exists,
// implement sendMessageToAI and call it from there instead.
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export async function sendMessageToAI(message) {
  const res = await fetch(`${API_BASE_URL}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message }),
  })
  if (!res.ok) throw new Error('AI Coach request failed')
  return res.json()
}
