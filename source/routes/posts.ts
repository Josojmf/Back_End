import express from 'express';
import controller from '../controllers/posts';
const router = express.Router();

router.get('/characters', controller.getPosts);
router.get('/status',controller.getStatus);
router.get('/character/:id', controller.getPost);
router.delete('/character/:id', controller.deletePost);
//router.post('/posts', controller.addPost);
router.put('/switchstatus/:id',controller.switchStatus)

export = router;