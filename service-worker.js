const CACHE_NAME = 'consumo-nebulizacao-v1';

// Lista de arquivos essenciais para o app funcionar offline.
const URLS_TO_CACHE = [
  './', // O mesmo que index.html
  './index.html',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.2.0/css/all.min.css', // Cache da fonte de ícones
  './icons/icon-192x192.png',
  './icons/icon-512x512.png'
  // Adicione aqui outros ícones se desejar que apareçam na tela de splash.
];

// Evento de Instalação: Salva os arquivos essenciais no cache.
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache aberto');
        return cache.addAll(URLS_TO_CACHE);
      })
  );
});

// Evento de Fetch: Intercepta as requisições.
self.addEventListener('fetch', event => {
  // Ignora as requisições para a API do Google, sempre buscando na rede.
  if (event.request.url.includes('script.google.com')) {
    event.respondWith(fetch(event.request));
    return;
  }

  // Para todas as outras requisições (app shell), usa a estratégia "cache-first".
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Se encontrar no cache, retorna a resposta do cache.
        if (response) {
          return response;
        }
        // Se não, busca na rede.
        return fetch(event.request);
      })
  );
});

// Opcional: Limpa caches antigos em uma nova ativação.
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
