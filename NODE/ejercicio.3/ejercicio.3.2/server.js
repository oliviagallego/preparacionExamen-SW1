const http = require('http');
const { URL } = require('url');
const config = require('./config.json');
const frasesData = require('./frase.json');

const frasesBase = frasesData.frases;

function getRandomFrase(num) {
  const frases = [];

  for (let i = 0; i < num; i++) {
    const randomIndex = Math.floor(Math.random() * frasesBase.length);
    frases.push(frasesBase[randomIndex]);
  }

  return frases.join(' - ');
}

const server = http.createServer((req, res) => {
  if (req.method === 'GET' && req.url.startsWith('/')) {
    const fullUrl = new URL(req.url, `http://${req.headers.host}`);
    const xParam = fullUrl.searchParams.get('x');

    let numSentences = parseInt(xParam, 10);
    if (isNaN(numSentences) || numSentences <= 0) {
      numSentences = 3;
    }

    const frases = getRandomFrase(numSentences);

    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.end(`Tus frases aleatorias son: ${frases}\n`);
  } else {
    res.statusCode = 404;
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.end('Not Found\n');
  }
});

const PORT = config.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
