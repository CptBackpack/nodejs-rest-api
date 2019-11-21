import {
  Router
} from 'express';

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

router.post('/login/', async (req, res) => {
  var authToken;
  const user = await req.context.models.User.findByLogin(
    req.body.userLogin,
    req.body.userPassword
  );
  if (user.username != "INVALID") {
    if (user.authToken == "") {
      authToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      user.authToken = authToken;
      const addToken = await req.context.models.User.updateOne(
        {_id: user.id}, 
        {authToken: user.authToken})
    }
  }
  const log = await req.context.models.Log.create({
    user: user.id,
    action: "GET /user/:userLogin"
  })

  console.log('[LOGIN REQUEST] > ');
  console.log(req.body);
  console.log("======================================");
  // 
  return res.send(user);
});


router.post('/checkUser/', async (req, res) => {
  console.log(req.body);
  const user = await req.context.models.User.findByToken(
    req.body.userLogin,
    req.body.authToken
  );
  console.log(user);
  if (user.username != "EXPIRED") {
    const log = await req.context.models.Log.create({
      user: user.id,
      action: "GET /user/:userId"
    })
  }
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
    user:user.id,
    action: "DELETE /user/:userId"
  })
  return res.send(result);
});

export default router;