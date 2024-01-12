export interface Deployment {
  deployment: string;
  maxTokens: number;

  // USD per 1000 tokens
  price: number;
}

// 'gpt-35-turbo', 'gpt-35-turbo-16k', 'gpt-4', 'gpt-4-32k'
export const Deployments: Deployment[] = [
  {
    deployment: "gpt-35-turbo",
    maxTokens: 4 * 1024,
    price: 0.0015,
  },
  {
    deployment: "gpt-35-turbo-16k",
    maxTokens: 16 * 1024,
    price: 0.003,
  },
  {
    deployment: "gpt-4",
    maxTokens: 8 * 1024,
    price: 0.03,
  },
  {
    deployment: "gpt-4-32k",
    maxTokens: 32 * 1024,
    price: 0.06,
  },
];

export const DeploymentNames: string[] = Deployments.map((d) => d.deployment);
export const DeploymentMap: Record<string, Deployment> = Deployments.reduce((map: Record<string, Deployment>, d) => {
  map[d.deployment] = d;
  return map;
}, {});

export const DefaultDeployment: Deployment = DeploymentMap["gpt-4"];
