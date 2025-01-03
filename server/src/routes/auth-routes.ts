import { Router, Request, Response } from 'express';
import { User } from '../models/user.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

// If the user exists and the password is correct, return a JWT token
export const login = async (req: Request, res: Response) => {
    const { username, password } = req.body;
  
    try {
    const user = await User.findOne({
      where: { username },
    });
    if (!user) {
      res.status(401).json({ message: 'Authentication failed' });
      return
    }
  
    const passwordIsValid = await bcrypt.compare(password, user.password);
    if (!passwordIsValid) {
      res.status(401).json({ message: 'Authentication failed' });
      return
    }
  
    const secretKey = process.env.JWT_SECRET_KEY || '';
  
    const token = jwt.sign({ username, assignedUserId:user.id }, secretKey, { expiresIn: '1h' });
    res.json({ token });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error', error});
    }
  };
  
  const router = Router();
  
  // POST /login - Login a user
  router.post('/login', login);
  
  export default router;