import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Question } from './entities/question.entity';
import {
  IQuestionsServiceCreate,
  IQuestionsServiceDelete,
  IQuestionsServiceFIndReview,
  IQuestionsServiceUpdate,
} from './interfaces/questions.service.interface';

Injectable();
export class QuestionsService {
  constructor(
    @InjectRepository(Question)
    private readonly questionsRepository: Repository<Question>,

    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async create({
    createQuestionInput,
    id,
    productId,
  }: IQuestionsServiceCreate): Promise<Question> {
    if (productId) {
      try {
        const result = await this.questionsRepository.save({
          product: { id: productId },
          ...createQuestionInput,
          user: { id },
        });
        return result;
      } catch (err) {
        throw new UnprocessableEntityException(
          '올바른 제품 Id를 입력해 주세요',
        );
      }
    }
  }
  async update({
    questionId, //
    updateQuestionInput,
    id,
  }: IQuestionsServiceUpdate): Promise<Question> {
    const target = await this.questionsRepository.findOne({
      where: { id: questionId },
      relations: ['user', 'product'],
    });
    if (!target) {
      throw new UnprocessableEntityException('존재하지 않는 글 입니다.');
    }

    if (target.user.id !== id) {
      throw new UnprocessableEntityException('이 글을 수정할 권한이 없습니다.');
    }
    const result = await this.questionsRepository.save({
      ...target,
      updateQuestionInput,
    });
    return result;
  }

  findQuestion({ id }: IQuestionsServiceFIndReview): Promise<Question> {
    return this.questionsRepository.findOne({
      where: { id },
      relations: ['user', 'product'],
    });
  }

  async delete({ questionId, id }: IQuestionsServiceDelete): Promise<boolean> {
    const target = await this.questionsRepository.findOne({
      where: { id: questionId },
      relations: ['user', 'product'],
    });
    if (!target) {
      throw new UnprocessableEntityException('글이 존재하지 않습니다.');
    }
    if (target.user.id !== id) {
      throw new UnprocessableEntityException(
        '문의글을 수정할 권한이 없습니다.',
      );
    }
    const result = await this.questionsRepository.delete({
      id: questionId,
    });
    return result.affected ? true : false;
  }
}
