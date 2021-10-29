import express from 'express';
import router from './routes';

const app = express();
const port = 3000;

app.use('/api', router);

module.exports = app.listen(port, () => {
  console.log(`Server started at ${port}.`);
});
