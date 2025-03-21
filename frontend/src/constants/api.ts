
export const BACKEND_URL = 
  typeof window !== 'undefined' 
    ? window.ENV_BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL || 'https://85a34aa98b710d.lhr.life' 
    : process.env.NEXT_PUBLIC_BACKEND_URL || 'https://85a34aa98b710d.lhr.life';


export const API_URL = `${BACKEND_URL}/api`;

console.log('Constantes de API carregadas:');
console.log('- BACKEND_URL:', BACKEND_URL);
console.log('- API_URL:', API_URL);
