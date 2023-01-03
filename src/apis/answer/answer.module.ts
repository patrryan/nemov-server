import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Question } from '../questions/entities/question.entity';
import { User } from '../users/entities/user.entity';
import { AnswersResolver } from './answer.resolver';
import { AnswersService } from './answer.service';
import { Answer } from './entities/answer.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Answer, //
      User,
      Question,
    ]),
  ],
  providers: [
    AnswersResolver, //
    AnswersService,
  ],
})
export class AnswersModule {}
