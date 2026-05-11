// Map<conversation_id + thought_text_hash, signature>
const signatureCache = new Map<string, string>();

// Map<tool_call_id, signature>
const signatureByCallIdCache = new Map<string, string>();

export function cacheSignature(conversationId: string, thought: string, signature: string) {
  const key = `${conversationId}:${Bun.hash(thought)}`; 
  signatureCache.set(key, signature);
  
  if (signatureCache.size > 1000) {
    const first = signatureCache.keys().next().value;
    if (first) signatureCache.delete(first);
  }
}

export function getSignature(conversationId: string, thought: string): string | undefined {
  const key = `${conversationId}:${Bun.hash(thought)}`;
  return signatureCache.get(key);
}

export function cacheSignatureByCallId(callId: string, signature: string) {
  signatureByCallIdCache.set(callId, signature);
  if (signatureByCallIdCache.size > 10000) {
    const first = signatureByCallIdCache.keys().next().value;
    if (first) signatureByCallIdCache.delete(first);
  }
}

export function getSignatureByCallId(callId: string): string | undefined {
  return signatureByCallIdCache.get(callId);
}
