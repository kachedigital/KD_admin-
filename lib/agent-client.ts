import { useVault } from '@/store/vault';

interface AgentRequest {
  prompt: string;
  context?: string;
  overrideKey?: string;
}

export const callReslivin = async ({ prompt, context, overrideKey }: AgentRequest) => {
  let activeKey = overrideKey;

  if (!activeKey) {
    const { retrieveKeys } = useVault.getState();
    const keys = await retrieveKeys();
    activeKey = keys.openAiKey;
  }

  if (!activeKey) {
    throw new Error("Vault is locked. Please complete the setup wizard.");
  }

  const response = await fetch('/api/agent', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-byok-openai': activeKey, // Decrypted key or override key passed in header
    },
    body: JSON.stringify({ prompt, context }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Agent failed to respond.');
  }

  return await response.json();
};
