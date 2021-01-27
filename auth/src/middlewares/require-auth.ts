import { Request, Response, NextFunction } from 'express';

const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  if (!req.currentUser) {
    return res.status(401).send({ errors: [{ message: 'not authorized' }] });
  }
  next();
};

export default requireAuth;
