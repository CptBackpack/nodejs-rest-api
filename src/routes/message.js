import uuidv4 from 'uuid/v4';
import { Router } from 'express';

const router = Router();

router.get('/', async (req, res) => {
  let messages = await req.context.models.Message.find();
  
  let l = messages.length;
  for (let i = 0; i < l; i++){
    messages[i].user = await req.context.models.User.findById(
      messages[i].user,
    )
  }
  const log = await req.context.models.Log.create({
    user: req.context.me.id,
    action: "GET /message"
  })
  return res.send(messages);
});

router.get('/:messageId', async (req, res) => {
  const message = await req.context.models.Message.findById(
    req.params.messageId,
  );
  const log = await req.context.models.Log.create({
    user: req.context.me.id,
    action: "GET /message/:messageId"
  })
  return res.send(message);
});

router.post('/', async (req, res) => {
  const message = await req.context.models.Message.create({
    text: req.body.text,
    user: req.context.me.id,
  });
  const log = await req.context.models.Log.create({
    user: req.context.me.id,
    action: "POST /message"
  })
  return res.send(message);
});

router.delete('/:messageId', async (req, res) => {
  const message = await req.context.models.Message.findById(
    req.params.messageId,
  );
  let result = null;
  if (message) {
    result = await message.remove();
  }

  const log = await req.context.models.Log.create({
    user: req.context.me.id,
    action: "DELETE /message/:messageId"
  })

  return res.send(result);
});


export default router;