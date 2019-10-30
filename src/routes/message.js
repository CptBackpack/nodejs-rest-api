import uuidv4 from 'uuid/v4';
import { Router } from 'express';

const router = Router();

router.get('/', async (req, res) => {
  let messages = await req.context.models.Message.find();

  // console.log(await req.context.models.User.findById(
  //   messages.user,
  // ));
  
  let l = messages.length;
  for (let i = 0; i < l; i++){
    messages[i].user = await req.context.models.User.findById(
      messages[i].user,
    )
  }

  return res.send(messages);
});

router.get('/:messageId', async (req, res) => {
  const message = await req.context.models.Message.findById(
    req.params.messageId,
  );
  return res.send(message);
});

router.post('/', async (req, res) => {
  const message = await req.context.models.Message.create({
    text: req.body.text,
    user: req.context.me.id,
  });
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
  return res.send(result);
});


export default router;