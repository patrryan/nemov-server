import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Question } from '../questions/entities/question.entity';
import { User } from '../users/entities/user.entity';
import { Answer } from './entities/answer.entity';
import {
  IAnswersServiceCreate,
  IAnswersServiceDelete,
  IAnswersServiceFindOne,
  IAnswersServiceUpdate,
} from './interfaces/answers.service.interface';

@Injectable()
export class AnswersService {
  constructor(
    @InjectRepository(Answer)
    private readonly answersRepository: Repository<Answer>,

    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,

    @InjectRepository(Question)
    private readonly questionsRepository: Repository<Question>,
  ) {}

  async findOne({ id }: IAnswersServiceFindOne): Promise<Answer> {
    return await this.answersRepository.findOne({
      where: { id },
      relations: ['user', 'question'],
    });
  }

  async findOneByQuestion({ questionId }) {
    const list = await this.questionsRepository.findOne({
      where: { id: questionId },
      relations: ['answer'],
    });

    if (!list) {
      throw new NotFoundException('헤당 문의가 존재하지 않습니다.');
    }

    return list.answer;
  }

  async create({
    questionId,
    contents,
    id,
  }: IAnswersServiceCreate): Promise<Answer> {
    const question = await this.questionsRepository.findOne({
      where: { id: questionId },
      relations: ['product', 'product.user'],
    });

    if (!question)
      throw new UnprocessableEntityException('해당 문의가 존재하지 않습니다.');

    if (question.product.user.id !== id)
      throw new UnprocessableEntityException('답변을 작성할 권한이 없습니다.');

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
  }: IAnswersServiceUpdate): Promise<Answer> {
    const target = await this.answersRepository.findOne({
      where: { id: answerId },
      relations: ['question', 'user'],
    });

    if (!target)
      throw new UnprocessableEntityException('해당 문의가 존재하지 않습니다.');

    if (target.user.id !== id) {
      throw new UnprocessableEntityException('해당 댓글을 쓸 권한이 없습니다.');
    }

    const result = await this.answersRepository.save({
      ...target,
      contents,
    });

    return result;
  }

  async delete({ answerId, id }: IAnswersServiceDelete): Promise<boolean> {
    const target = await this.answersRepository.findOne({
      where: { id: answerId },
      relations: ['user'],
    });
    if (!target) {
      throw new UnprocessableEntityException('해당 답글이 존재하지 않습니다.');
    }
    if (target.user.id !== id) {
      throw new UnprocessableEntityException('글을 수정할 권한이 없습니다.');
    }
    const result = await this.answersRepository.delete({
      id: answerId,
    });
    return result.affected ? true : false;
  }
}
