export async function getBalance(azureApiKey: string, azureApiUrl: string): Promise<number> {
  const resp = await fetch(`${azureApiUrl}/openai-balance/get`, { headers: { "api-key": azureApiKey } });
  const json = await resp.json();
  if (typeof json === "number") {
    return json;
  } else {
    throw new Error(`Unexpected response from Azure: ${JSON.stringify(json)}`);
  }
}
