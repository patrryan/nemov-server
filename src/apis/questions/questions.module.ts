import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Answer } from '../answer/entities/answer.entity';
import { Product } from '../products/entities/product.entity';
import { Question } from './entities/question.entity';
import { QuestionsResolver } from './questions.resolver';
import { QuestionsService } from './questions.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Question, //
      Answer,
      Product,
    ]),
  ],
  providers: [
    QuestionsResolver, //
    QuestionsService,
  ],
})
export class QuestionsModule {}
