const { server } = require('./app');
const connection = require('./node/src/config/db');

const port = process.env.PORT || 3000;

connection();

server.listen(port, () => {
  console.log(`app listening on port ${port}`);
});