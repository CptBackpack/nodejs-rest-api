import { Router } from 'express';

const router = Router();

router.get('/', async (req, res) => {

  const log = await req.context.models.Log.create({
    user: req.context.me.id,
    action: "GET /session"
  })

  return res.send(req.context.models.users[req.context.me.id]);
});

export default router;