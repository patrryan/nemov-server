import {
  CACHE_MANAGER,
  ConflictException,
  Inject,
  Injectable,
} from '@nestjs/common';
import coolsms from 'coolsms-node-sdk';
import { Cache } from 'cache-manager';
import {
  IPhoneServiceCheckToken,
  IPhoneServiceSendTokenForSMS,
} from './interfaces/phone-service.interface';

@Injectable()
export class PhoneService {
  constructor(
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  async sendTokenToSMS({
    phone,
    reason,
  }: IPhoneServiceSendTokenForSMS): Promise<string> {
    const isGenerated = await this.cacheManager.get(`${phone}-${reason}`);

    if (isGenerated) {
      throw new ConflictException('나중에 다시 요청을 해주세요.');
    }

    const token = String(Math.floor(Math.random() * 1000000)).padStart(6, '0');

    const phoneConverted = phone.split('-').join('');

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

    await this.cacheManager.set(`${phone}-${reason}`, token, {
      ttl: 180,
    });

    return '인증번호를 발송했습니다.';
  }

  async checkToken({
    phone,
    token,
    reason,
  }: IPhoneServiceCheckToken): Promise<boolean> {
    const myToken = await this.cacheManager.get(`${phone}-${reason}`);
    if (myToken === token) {
      await this.cacheManager.set(`${phone}-${reason}`, true, { ttl: 600 });
      return true;
    }
    return false;
  }

  async checkIfVerified({ phone, reason }) {
    const result = await this.cacheManager.get(`${phone}-${reason}`);
    if (!result) {
      return false;
    } else {
      return true;
    }
  }
}
