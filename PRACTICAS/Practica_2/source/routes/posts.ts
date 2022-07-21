import express from 'express';
import controller from '../controllers/posts';
//Exports for express router
const router = express.Router();
router.get('/status', controller.getStatus);
router.get('/characters', controller.getPosts);
router.get('/character/:id', controller.getPost);
router.put('/switchstatus/:id', controller.switchStatus);
router.delete('/character/:id', controller.deletePost);
router.post('/addPost',controller.addPost);
export = router;

