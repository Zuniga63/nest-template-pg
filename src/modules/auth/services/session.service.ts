import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import type { AuthLoginParams } from '../types';
import { Session } from '../entities/session.entity';

@Injectable()
export class SessionService {
  constructor(
    @InjectRepository(Session)
    private readonly sessionRepository: Repository<Session>,
  ) {}

  async createSession({ user, ip, userAgent }: AuthLoginParams) {
    const session = this.sessionRepository.create({
      user,
      ipAddress: ip,
      userAgent,
      lastActivity: new Date(Date.now()),
    });

    return this.sessionRepository.save(session);
  }

  async updateLastActivity(id: string) {
    return this.sessionRepository.update(id, { lastActivity: new Date(Date.now()) });
  }

  async findAllByUserId(userId: string) {
    return this.sessionRepository.find({ where: { user: { id: userId } }, order: { lastActivity: 'DESC' } });
  }

  async deleteSession(id: string) {
    return this.sessionRepository.delete(id);
  }
}
