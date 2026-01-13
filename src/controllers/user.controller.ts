import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.js';
import { UserService } from '../services/user.service.js';

const userService = new UserService();

export class UserController {
  async getMany(req: AuthRequest, res: Response): Promise<void> {
    const users = await userService.getMany();
    res.json(users);
  }
}
