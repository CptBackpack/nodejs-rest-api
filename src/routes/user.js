import { Router } from 'express';
 
const router = Router();

router.get('/', async (req, res) => {
  const user = await req.context.models.User.find();
  const log = await req.context.models.Log.create({
    user: req.context.me.id,
    action: "GET /user"
  })
  return res.send(user);
});

router.get('/:userId', async (req, res) => {
  const user = await req.context.models.User.findById(
    req.params.userId,
  );
  const log = await req.context.models.Log.create({
    user: req.context.me.id,
    action: "GET /user/:userId"
  })
  return res.send(user);
});

router.post('/checkUser/', async (req, res) => {
  const user = await req.context.models.User.findByLogin(
    req.body.userLogin,
  );
  const log = await req.context.models.Log.create({
    user: req.context.me.id,
    action: "GET /user/:userLogin"
  })
  return res.send(user);
});

router.post('/', async (req, res) => {
  const user = await req.context.models.User.create({
    username: req.body.username
  });
  const log = await req.context.models.Log.create({
    user: req.context.me.id,
    action: "POST /user"
  })
  return res.send(user);
});


router.delete('/:userId', async (req, res) => {
  const user = await req.context.models.User.findById(
    req.params.userId,
  );
  let result = null;
  if (user) {
    result = await user.remove();
  }
  const log = await req.context.models.Log.create({
    user: req.context.me.id,
    action: "DELETE /user/:userId"
  })
  return res.send(result);
});

export default router;