import { Router } from 'express';
import { Registry, collectDefaultMetrics } from 'prom-client';

const router = Router();
const register = new Registry();

collectDefaultMetrics({ register });

router.get('/', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});

export default router;
