import express from 'express';

const router = express.Router();

router.post('/api/users/signout', (req: any, res) => {
  req.session = null;
  res.send({});
});

export { router as signOutRouter };
