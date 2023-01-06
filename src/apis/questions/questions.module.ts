import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from '../products/entities/product.entity';
import { User } from '../users/entities/user.entity';
import { Question } from './entities/question.entity';
import { QuestionsResolver } from './questions.resolver';
import { QuestionsService } from './questions.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Question, //
      User,
      Product,
    ]),
  ],
  providers: [
    QuestionsResolver, //
    QuestionsService,
  ],
})
export class QuestionsModule {}
