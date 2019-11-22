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
  let authToken;
  const user = await req.context.models.User.findByLogin(
    req.body.userLogin,
    req.body.userPassword
  );
  if (user.username != "INVALID") {
    if (user.authToken == "") {
      authToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      user.authToken = authToken;
      let ExpiryDate = new Date();
      ExpiryDate.setMinutes(ExpiryDate.getMinutes() + 120);
      user.authTokenExpireDate = ExpiryDate;
      const addToken = await req.context.models.User.updateMany(
        {_id: user.id}, 
        {authToken: user.authToken,
        authTokenExpireDate: ExpiryDate})
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
  let CurrentDate = new Date();
  let ExpiryDate = new Date(user.authTokenExpireDate);
  
  if(CurrentDate > ExpiryDate){
    console.log("Expired!");
    const removeTOken = await req.context.models.User.updateOne(
      {_id: user.id}, 
      {authToken: '',
      authTokenExpireDate: ''})
      user.username = "EXPIRED";
      user.authToken = '';
      user.authTokenExpireDate = '';
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