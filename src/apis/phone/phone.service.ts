import {
  CACHE_MANAGER,
  ConflictException,
  Inject,
  Injectable,
} from '@nestjs/common';
import coolsms from 'coolsms-node-sdk';
import { Cache } from 'cache-manager';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PhoneService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,

    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  async sendTokenToSMS({ phone }) {
    const result = await this.usersRepository.findOne({
      where: { phone },
    });
    if (result) {
      throw new ConflictException('이미 등록된 번호입니다.');
    }

    const phoneConverted = phone.split('-').join('');

    const token = String(Math.floor(Math.random() * 1000000)).padStart(6, '0');

    const messageService = new coolsms(
      process.env.SMS_KEY,
      process.env.SMS_SECRET,
    );
    messageService.sendOne({
      to: phoneConverted,
      from: process.env.SMS_SENDER,
      text: `[NEMO-V 발신] 안녕하세요!!! 요청하신 인증번호는 ${token} 입니다!.`,
      type: 'SMS',
      autoTypeDetect: false,
    });

    await this.cacheManager.set(phone, token, {
      ttl: 300,
    });
    return token;
  }

  async checkToken({ phone, token }) {
    const myToken = await this.cacheManager.get(phone);
    if (myToken === token) {
      await this.cacheManager.set(phone, true, { ttl: 0 });
      return true;
    }
    return false;
  }
}
