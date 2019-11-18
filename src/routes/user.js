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
  var token;
  const user = await req.context.models.User.findByLogin(
    req.body.userLogin,
  	req.body.userPassword
  );

  if(user.username != "INVALID"){
    if(user.token == null){
      token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      user["token"] = token;
      const addToken = await req.context.models.User.update(
        {_id: user.id},
        {token:user.token}
      )
      console.log(addToken);
    }
  }
  const log = await req.context.models.Log.create({
    user: req.context.me.id,
    action: "GET /user/:userLogin"
  }) 
  
  console.log('[LOGIN REQUEST] > ');
  console.log(req.body);
  console.log("======================================");
  // console.log(user);
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