import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import bcrypt from 'bcryptjs';
import { User } from './user.entity.js';

@Injectable()
export class UsersService implements OnModuleInit {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  findByUsername(username: string) {
    return this.usersRepository.findOneBy({ username });
  }

  // Runs on startup: create the RM account "dana" if it does not exist yet.
  async onModuleInit() {
    const existingUser = await this.findByUsername('dana');
    if (existingUser) {
      return;
    }

    const passwordHash = await bcrypt.hash('dana123', 10);
    await this.usersRepository.save({ username: 'dana', passwordHash });
  }
}
