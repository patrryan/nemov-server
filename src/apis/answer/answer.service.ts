// import { Injectable, UnprocessableEntityException } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// import { Question } from '../questions/entities/question.entity';
// import { User } from '../users/entities/user.entity';
// import { Answer } from './entities/answer.entity';
// import {
//   IAnswersServiceCreate,
//   IAnswersServiceDelete,
//   IAnswersServiceFindAnswer,
// } from './interfaces/answers.service.interface';

// Injectable();
// export class AnswersService {
//   constructor(
//     @InjectRepository(Answer)
//     private readonly answersRepository: Repository<Answer>,

//     @InjectRepository(User)
//     private readonly usersRepository: Repository<User>,

//     @InjectRepository(Question)
//     private readonly questionsRepository: Repository<Question>,
//   ) {}

//   findAnswer({ id }: IAnswersServiceFindAnswer): Promise<Answer> {
//     return this.answersRepository.findOne({
//       where: { id },
//       relations: ['user', 'question'],
//     });
//   }

//   // create
//   //   async create({
//   //     answerId,
//   //     answer_contents
//   //     id,
//   //   }: IAnswersServiceCreate): Promise<Answer> {}

//   //  update

//   async delete({ answerId, id }: IAnswersServiceDelete): Promise<boolean> {
//     const target = await this.answersRepository.findOne({
//       where: { id: answerId },
//       relations: ['user', 'questions'],
//     });
//     if (!target) {
//       throw new UnprocessableEntityException('해당 답글이 존재하지 않습니다.');
//     }
//     if (target.user.id !== id) {
//       throw new UnprocessableEntityException('글을 수정할 권한이 없습니다.');
//     }
//     const result = await this.answersRepository.delete({
//       id: answerId,
//     });
//     return result.affected ? true : false;
//   }
// }
