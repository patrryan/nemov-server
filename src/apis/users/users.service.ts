import {
  CACHE_MANAGER,
  ConflictException,
  HttpException,
  Inject,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import axios from 'axios';
import { Cache } from 'cache-manager';
import { Repository } from 'typeorm';
import { ROLE_TYPE, User } from './entities/user.entity';
import {
  IUsersServiceCheckBLN,
  IUsersServiceCreate,
  IUsersServiceFindOneByEmail,
  IUsersServiceFindOneById,
  IUsersServiceLoginDelete,
  IUsersServiceRestore,
  IUsersServiceUpdate,
  IUsersServiceUpdatePassword,
  IUsersServiceValidateUser,
  IUsersServiceVerifyPassword,
} from './interfaces/users-service.interface';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  async findOneById({ id }: IUsersServiceFindOneById): Promise<User> {
    return await this.usersRepository.findOne({ where: { id } });
  }

  async checkBLN({ bln }: IUsersServiceCheckBLN): Promise<boolean> {
    try {
      const blnConverted = bln.split('-').join('');
      const result = await axios({
        url: `https://api.odcloud.kr/api/nts-businessman/v1/status?serviceKey=${process.env.BLN_SERVICE_KEY}`,
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        data: {
          b_no: [blnConverted],
        },
      });

      const { b_stt_cd, tax_type, tax_type_cd, end_dt } = result.data.data[0];

      if (
        b_stt_cd === '02' ||
        b_stt_cd === '03' ||
        tax_type_cd === '05' ||
        tax_type === '국세청에 등록되지 않은 사업자등록번호입니다.' ||
        end_dt
      ) {
        return false;
      }
      await this.cacheManager.set(bln, true, { ttl: 0 });
      return true;
    } catch (error) {
      throw new HttpException('에러 발생', 400);
    }
  }

  async validateUser({
    email,
    phone,
    bln,
  }: IUsersServiceValidateUser): Promise<void> {
    const result1 = await this.findOneByEmail({ email });

    if (result1) throw new ConflictException('이미 가입된 회원입니다.');

    const result2 = await this.usersRepository.findOne({ where: { phone } });

    if (result2) throw new ConflictException('이미 가입된 회원입니다.');

    const result3 = await this.cacheManager.get(phone);

    if (result3 !== true) {
      throw new UnprocessableEntityException(
        '휴대폰 본인 인증 완료 후 회원가입을 진행해주세요.',
      );
    }

    if (bln) {
      const result4 = await this.cacheManager.get(bln);

      if (!result4)
        throw new UnprocessableEntityException(
          '사업자등록번호 인증 후 회원가입을 진행해주세요.',
        );

      const result5 = await this.usersRepository.findOne({ where: { bln } });

      if (result5) throw new ConflictException('이미 가입된 회원입니다.');

      await this.cacheManager.del(bln);
    }

    await this.cacheManager.del(phone);
  }

  async checkEmail({ email }) {
    const result = await this.usersRepository.findOne({ where: { email } });

    return result ? false : true;
  }

  findOneByEmail({ email }: IUsersServiceFindOneByEmail): Promise<User> {
    return this.usersRepository.findOne({
      where: { email },
      withDeleted: true,
    });
  }

  async create({ createUserInput }: IUsersServiceCreate): Promise<User> {
    const { name, email, password, phone, bln, ...rest } = createUserInput;
    await this.validateUser({ email, phone, bln });

    const hashedPassword = await bcrypt.hash(password, 10);

    if (bln) {
      return await this.usersRepository.save({
        name,
        email,
        password: hashedPassword,
        phone,
        bln,
        role: ROLE_TYPE.SELLER,
      });
    } else {
      return await this.usersRepository.save({
        name,
        email,
        password: hashedPassword,
        phone,
        ...rest,
        role: ROLE_TYPE.BUYER,
      });
    }
  }

  async verifyPassword({
    id,
    password,
  }: IUsersServiceVerifyPassword): Promise<boolean> {
    const target = await this.findOneById({ id });

    return await bcrypt.compare(password, target.password);
  }

  async update({ id, updateUserInput }: IUsersServiceUpdate): Promise<User> {
    const result = await this.findOneById({ id });

    return await this.usersRepository.save({ ...result, ...updateUserInput });
  }

  async updatePassword({
    id,
    password,
  }: IUsersServiceUpdatePassword): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await this.findOneById({ id });

    return await this.usersRepository.save({
      ...result,
      password: hashedPassword,
    });
  }

  async loginDelete({ id }: IUsersServiceLoginDelete): Promise<boolean> {
    const result = await this.usersRepository.softDelete({ id });
    return result.affected ? true : false;
  }

  async restore({ email }: IUsersServiceRestore): Promise<boolean> {
    const result = await this.usersRepository.restore({
      email,
    });
    return result.affected ? true : false;
  }
}
