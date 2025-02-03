export const META_CONFIG = {
  API_TOKEN: import.meta.env.VITE_META_API_TOKEN,
  API_VERSION: 'v17.0', // Versão atual da API do Meta
  BASE_URL: 'https://graph.facebook.com',
  TEST_EVENT_CODE: 'TEST64341', // Código de teste para eventos
};

export const getMetaHeaders = () => ({
  Authorization: `Bearer ${META_CONFIG.API_TOKEN}`,
  'Content-Type': 'application/json',
});

// Função auxiliar para fazer requisições à API do Meta
export const metaApiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${META_CONFIG.BASE_URL}/${META_CONFIG.API_VERSION}/${endpoint}`;
  const headers = getMetaHeaders();

  // Adiciona o código de teste aos eventos
  const body = options.body ? JSON.parse(options.body as string) : {};
  const modifiedBody = {
    ...body,
    test_event_code: META_CONFIG.TEST_EVENT_CODE,
  };

  try {
    const response = await fetch(url, {
      ...options,
      body: JSON.stringify(modifiedBody),
      headers: {
        ...headers,
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`Meta API request failed: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error making Meta API request:', error);
    throw error;
  }
}; 