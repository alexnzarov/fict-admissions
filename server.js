const express = require('express');
const cors = require('cors');
const basicAuth = require('express-basic-auth');
const next = require('next');

const app = next({
  dev: process.env.NODE_ENV !== 'production',
});

const handle = app.getRequestHandler();

const users = {
  alexnzarov: 'fwJYzcBjph',
  ruthennium: 'eANRShPyst',
  op: 'nXHsslKjkZ',
};

(async () => {
  await app.prepare();

  const server = express();
  
  server.use(cors());
  server.use(basicAuth({ users, challenge: true }));
  server.use((req, res, next) => {
    const auth = req.headers.authorization;
    res.cookie('local.token', auth.split(' ')[1]);
    next();
  });

  server.get('*', (req, res) => handle(req, res));

  const port = process.env.PORT || 3000;
  await server.listen(port);

  console.log(`> Ready on http://localhost:${port}`);
})();
