import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import {
  IUsersServiceCreate,
  IUsersServiceFindOne,
} from './interfaces/users-service.interface';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  // 유저 생성
  async create({
    hashedPassword: password,
    createUserInput,
  }: IUsersServiceCreate): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { email: createUserInput.email },
    });
    if (user) throw new ConflictException('이미 등록된 이메일 입니다.');
    return this.usersRepository.save({
      ...createUserInput,
      password,
    });
  }

  // 이메일로 유저 조회
  findOne({ email }: IUsersServiceFindOne): Promise<User> {
    return this.usersRepository.findOne({
      where: { email },
      withDeleted: true,
    });
  }

  // 유저정보 복구
  async restore({ email }) {
    const result = await this.usersRepository.restore({
      email,
    });
    return result.affected ? true : false;
  }

  // 유저정보 업데이트
  async update({ context, updateUserInput }) {
    const prevUser = await this.usersRepository.findOne({
      where: { email: context.req.user.email },
    });
    const result = await this.usersRepository.save({
      ...prevUser,
      email: context.req.user.email,
      ...updateUserInput,
    });
    return result;
  }

  // 로그인한 유저 한사람 조회
  findLoginOne({ context }): Promise<User> {
    return this.usersRepository.findOne({
      where: { email: context.req.user.email },
    });
  }

  // 로그인한 유저 비밀번호 변경
  async updatePwd({ hashedPassword: password, user }) {
    const newPassword = {
      ...user,
      password,
    };
    return await this.usersRepository.save(newPassword);
  }

  // 로그인한 유저 삭제
  async loginDelete({ context }) {
    const result = await this.usersRepository.softDelete({
      email: context.req.user.email,
    });
    return result.affected ? true : false;
  }

  async findOneById({ id }) {
    return await this.usersRepository.findOne({ where: { id } });
  }
}
