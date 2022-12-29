import {
  CACHE_MANAGER,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
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
  // 토큰 보내기
  async sendTokenToSMS({ phone }) {
    const isValid = this.checkPhoneLength({ phone });
    if (isValid) {
      const digit = await this.usersRepository.findOne({
        where: { phoneNumber: phone },
      });
      if (digit) {
        throw new ConflictException('이미 등록된 번호입니다.');
      }
      const phoneToken = String(Math.floor(Math.random() * 1000000)).padStart(
        6,
        '0',
      );

      const text = `[NEMO-V 발신] 안녕하세요!!! 요청하신 인증번호는 ${phoneToken} 입니다!.`;

      const SMS_KEY = process.env.SMS_KEY;
      const SMS_SECRET = process.env.SMS_SECRET;
      const SMS_SENDER = process.env.SMS_SENDER;

      const messageService = new coolsms(SMS_KEY, SMS_SECRET);
      messageService.sendOne({
        to: phone,
        from: SMS_SENDER,
        text,
        type: 'SMS',
        autoTypeDetect: false,
      });

      const myToken = await this.cacheManager.get(phone);
      if (myToken) {
        await this.cacheManager.del(phone);
      }
      await this.cacheManager.set(phone, phoneToken, {
        ttl: 300,
      });
      return phoneToken;
    }
  }

  // 토큰 검증
  async checkToken({ phoneNumber, token }) {
    const myToken = await this.cacheManager.get(phoneNumber);
    if (myToken == token) {
      return true;
    }
    throw new UnprocessableEntityException('올바른 인증번호가 아닙니다.');
  }

  // 핸드폰검증
  checkPhoneLength({ phone }) {
    if (phone.length !== 10 && phone.length !== 11) {
      throw new NotFoundException('핸드폰 번호를 제대로 입력해주세요 ');
    } else {
      return true;
    }
  }
}
