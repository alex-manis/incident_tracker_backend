import { Router } from 'express';
import { prisma } from '../lib/prisma.js';

const router: Router = Router();

router.get('/', async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: 'ok', database: 'connected' });
  } catch (error) {
    res.status(503).json({ status: 'error', database: 'disconnected' });
  }
});

export default router;
