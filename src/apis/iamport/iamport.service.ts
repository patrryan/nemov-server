import {
  HttpException,
  Injectable,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import axios from 'axios';
@Injectable()
export class IamportService {
  async getAccessToken() {
    try {
      const result = await axios({
        url: 'https://api.iamport.kr/users/getToken',
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        data: {
          imp_key: process.env.IMP_KEY,
          imp_secret: process.env.IMP_SECRET,
        },
      });
      return result.data.response.access_token;
    } catch (e) {
      if (
        e.response.data.message ===
        'imp_key, imp_secret 파라메터가 누락되었습니다.'
      ) {
        throw new UnauthorizedException(e.response.data.message);
      }
      throw new HttpException(e.response.data.message, e.response.status);
    }
  }
  async getPaymentData({ impUid }) {
    try {
      const accessToken = await this.getAccessToken();
      const result = await axios({
        url: `https://api.iamport.kr/payments/${impUid}`,
        method: 'get',
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      return {
        amount: result.data.response.amount,
        status: result.data.response.status,
      };
    } catch (e) {
      if (e.response.status === 401) {
        throw new UnauthorizedException(e.response.data.message);
      }
      if (e.response.status === 404) {
        throw new UnprocessableEntityException('유효하지 않은 impUid입니다.');
      }
      throw new HttpException(e.response.data.message, e.response.status);
    }
  }
  async cancelTransaction({ imp_uid, amount }) {
    try {
      const accessToken = await this.getAccessToken();
      const result = await axios({
        url: 'https://api.iamport.kr/payments/cancel',
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        data: {
          reason: '네모비 프로젝트 환불',
          imp_uid,
          amount,
          checksum: amount,
        },
      });
      if (result.data.code !== 0) {
        throw new HttpException(result.data.message, 400);
      }
      return result.data.response.amount;
    } catch (e) {
      if (e.response.status === 401) {
        throw new UnauthorizedException(e.response.data.message);
      }
      throw new HttpException(e.response.data.message, e.response.status);
    }
  }
}
