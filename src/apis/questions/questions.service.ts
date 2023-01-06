import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Answer } from '../answer/entities/answer.entity';
import { Product } from '../products/entities/product.entity';
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

    @InjectRepository(Answer)
    private readonly answersRepository: Repository<Answer>,

    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async findAllByProduct({ productId, page }) {
    return await this.questionsRepository
      .createQueryBuilder('question')
      .leftJoinAndSelect('question.user', 'user')
      .where('question.product = :productId', { productId })
      .orderBy('question.createdAt', 'DESC')
      .skip((page - 1) * 10)
      .take(10)
      .getMany();
  }

  async findAllCountByProduct({ productId }) {
    return await this.questionsRepository
      .createQueryBuilder('question')
      .where('question.product = :productId', { productId })
      .getCount();
  }

  async findAllByBuyer({ page, id }) {
    return await this.questionsRepository
      .createQueryBuilder('question')
      .leftJoinAndSelect('question.product', 'product')
      .leftJoinAndSelect('question.answer', 'answer')
      .where('question.user = :id', { id })
      .orderBy('question.createdAt', 'DESC')
      .skip((page - 1) * 10)
      .take(10)
      .getMany();
  }

  async findAllCountByBuyer({ id }) {
    return await this.questionsRepository
      .createQueryBuilder('question')
      .where('question.user = :id', { id })
      .getCount();
  }

  async findAllBySeller({ page, id }) {
    return await this.questionsRepository
      .createQueryBuilder('question')
      .leftJoinAndSelect('question.product', 'product')
      .leftJoinAndSelect('question.answer', 'answer')
      .where('product.user = :id', { id })
      .orderBy('question.createdAt', 'DESC')
      .skip((page - 1) * 10)
      .take(10)
      .getMany();
  }

  async findAllCountBySeller({ id }) {
    return await this.questionsRepository
      .createQueryBuilder('question')
      .leftJoinAndSelect('question.product', 'product')
      .where('product.user = :id', { id })
      .getCount();
  }

  async create({
    createQuestionInput,
    id,
    productId,
  }: IQuestionsServiceCreate): Promise<Question> {
    const product = await this.productRepository.findOne({
      where: { id: productId },
    });

    if (!product)
      throw new UnprocessableEntityException('존재하지 않는 상품입니다.');

    return await this.questionsRepository.save({
      ...createQuestionInput,
      product: { ...product },
      user: { id },
    });
  }

  async update({
    questionId, //
    updateQuestionInput,
    id,
  }: IQuestionsServiceUpdate): Promise<Question> {
    const target = await this.questionsRepository.findOne({
      where: { id: questionId },
      relations: ['user', 'product', 'answer'],
    });
    if (!target) {
      throw new UnprocessableEntityException('존재하지 않는 글 입니다.');
    }

    if (target.user.id !== id) {
      throw new UnprocessableEntityException('이 글을 수정할 권한이 없습니다.');
    }

    if (target.answer) {
      throw new UnprocessableEntityException('답변이 있어 수정할 수 없습니다.');
    }

    const result = await this.questionsRepository.save({
      ...target,
      ...updateQuestionInput,
    });

    return result;
  }

  async findQuestion({ id }: IQuestionsServiceFIndReview): Promise<Question> {
    return await this.questionsRepository.findOne({
      where: { id },
      relations: ['user', 'product', 'answer'],
    });
  }

  async delete({ questionId, id }: IQuestionsServiceDelete): Promise<boolean> {
    const target = await this.questionsRepository.findOne({
      where: { id: questionId },
      relations: ['user', 'product', 'answer'],
    });

    if (!target) {
      throw new UnprocessableEntityException('글이 존재하지 않습니다.');
    }

    if (target.user.id !== id) {
      throw new UnprocessableEntityException(
        '문의글을 삭제할 권한이 없습니다.',
      );
    }

    await this.questionsRepository.update({ id: questionId }, { answer: null });

    await this.answersRepository.delete({ id: target.answer.id });

    const result = await this.questionsRepository.delete({
      id: questionId,
    });

    return result.affected ? true : false;
  }
}
