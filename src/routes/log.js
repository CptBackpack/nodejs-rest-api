import uuidv4 from 'uuid/v4';
import {
    Router
} from 'express';

const router = Router();

router.get('/', async (req, res) => {
    let logs = await req.context.models.Log.find();

    let l = logs.length;
    for (let i = 0; i < l; i++) {
        logs[i].user = await req.context.models.User.findById(
            logs[i].user,
        )
    }

    const log = await req.context.models.Log.create({
        user: req.context.me.id,
        action: "GET /log"
    })

    return res.send(logs);
});


export default router;