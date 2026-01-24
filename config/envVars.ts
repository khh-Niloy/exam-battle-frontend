const envConfig = {
  NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
  NEXT_PUBLIC_BASE_SOCKET_URL: process.env.NEXT_PUBLIC_BASE_SOCKET_URL,
};

Object.entries(envConfig).forEach(([key, value]) => {
  if (!value) {
    throw new Error(`env not found error -> ${key}`);
  }
});

export const envVars = envConfig as Record<keyof typeof envConfig, string>;
