import express from 'express';
import imageRouter from './api/image';

const router = express.Router();
router.use('/images', imageRouter);

router.get('/', (req: express.Request, res: express.Response) => {
  res.send('/api get');
});

export default router;
