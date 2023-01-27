import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Question } from '../questions/entities/question.entity';
import { Answer } from './entities/answer.entity';
import * as I from './interfaces/answers.service.interface';

@Injectable()
export class AnswersService {
  constructor(
    @InjectRepository(Answer)
    private readonly answersRepository: Repository<Answer>,

    @InjectRepository(Question)
    private readonly questionsRepository: Repository<Question>,
  ) {}

  async findOne({ answerId }: I.AnswersServiceFindOne): Promise<Answer> {
    return await this.answersRepository.findOne({
      where: { id: answerId },
      relations: ['user'],
    });
  }

  async findOneByQuestion({
    questionId,
  }: I.AnswersServiceFindOneByQuestion): Promise<Answer> {
    const question = await this.questionsRepository.findOne({
      where: { id: questionId },
      relations: ['answer'],
    });

    if (!question) {
      throw new NotFoundException('헤당 문의가 존재하지 않습니다.');
    }

    return question.answer;
  }

  async create({
    questionId,
    contents,
    id,
  }: I.AnswersServiceCreate): Promise<Answer> {
    const question = await this.questionsRepository.findOne({
      where: { id: questionId },
      relations: ['product', 'product.user'],
    });

    if (!question)
      throw new UnprocessableEntityException('해당 문의가 존재하지 않습니다.');

    if (question.product.user.id !== id)
      throw new UnauthorizedException('답변을 작성할 권한이 없습니다.');

    const result = await this.answersRepository.save({
      question: { ...question },
      user: { id },
      contents,
    });

    await this.questionsRepository.update(
      { id: questionId },
      { answer: { id: result.id } },
    );

    return result;
  }

  async update({
    answerId,
    contents,
    id,
  }: I.AnswersServiceUpdate): Promise<Answer> {
    const target = await this.answersRepository.findOne({
      where: { id: answerId },
      relations: ['question', 'user'],
    });

    if (!target)
      throw new UnprocessableEntityException('해당 문의가 존재하지 않습니다.');

    if (target.user.id !== id) {
      throw new UnauthorizedException('해당 답변을 수정할 권한이 없습니다.');
    }

    const result = await this.answersRepository.save({
      ...target,
      contents,
    });

    return result;
  }

  async delete({ answerId, id }: I.AnswersServiceDelete): Promise<boolean> {
    const target = await this.answersRepository.findOne({
      where: { id: answerId },
      relations: ['user'],
    });

    if (!target) {
      throw new UnprocessableEntityException('해당 답글이 존재하지 않습니다.');
    }
    if (target.user.id !== id) {
      throw new UnauthorizedException('해당 답변을 삭제할 권한이 없습니다.');
    }

    await this.questionsRepository.update(
      { answer: { id: answerId } },
      { answer: null },
    );

    const result = await this.answersRepository.delete({
      id: answerId,
    });

    return result.affected ? true : false;
  }
}
