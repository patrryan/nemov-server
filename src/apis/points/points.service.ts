import {
  ConflictException,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { IamportService } from '../iamport/iamport.service';
import { User } from '../users/entities/user.entity';
import { Point, POINT_TRANSACTION_STATUS_ENUM } from './entities/point.entity';

@Injectable()
export class PointsService {
  constructor(
    @InjectRepository(Point)
    private readonly pointsRepository: Repository<Point>,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly iamportService: IamportService,
    private readonly dataSource: DataSource,
  ) {}

  async createPointCharge({ impUid, amount, id }): Promise<Point> {
    await this.validateForPointCharge({ impUid, amount });

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction('SERIALIZABLE');

    try {
      const target = await queryRunner.manager.findOne(User, {
        where: { id },
        lock: { mode: 'pessimistic_write' },
      });

      const updatedUser = this.usersRepository.create({
        ...target,
        balance: target.balance + amount,
      });

      await queryRunner.manager.save(updatedUser);

      const payment = this.pointsRepository.create({
        impUid,
        amount,
        status: POINT_TRANSACTION_STATUS_ENUM.PAID,
        user: updatedUser,
      });

      await queryRunner.manager.save(payment);

      await queryRunner.commitTransaction();

      return payment;
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  async validateForPointCharge({ impUid, amount: _amount }): Promise<void> {
    const result = await this.pointsRepository.findOne({
      where: { impUid },
    });

    if (result) throw new ConflictException('이미 추가된 결제건입니다.');

    const { amount, status } = await this.iamportService.getPaymentData({
      impUid,
    });

    if (status !== 'paid') {
      throw new UnprocessableEntityException('결제가 완료되지 않았습니다.');
    }

    if (amount !== _amount) {
      throw new UnprocessableEntityException(
        '결제 금액 불일치! 위/변조 된 결제입니다.',
      );
    }
  }

  async cancelPointCharge({ impUid, id }) {
    const { amount, user } = await this.validateForPointRefund({ impUid, id });

    const refundAmount = await this.iamportService.cancelTransaction({
      imp_uid: impUid,
      amount,
    });

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction('SERIALIZABLE');

    try {
      const updatedUser = this.usersRepository.create({
        ...user,
        balance: user.balance - refundAmount,
      });

      await queryRunner.manager.save(updatedUser);

      const payment = this.pointsRepository.create({
        impUid,
        amount: -refundAmount,
        status: POINT_TRANSACTION_STATUS_ENUM.CANCELLED,
        user: updatedUser,
      });

      await queryRunner.manager.save(payment);

      await queryRunner.commitTransaction();

      return payment;
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  async validateForPointRefund({ impUid, id }) {
    const target = await this.usersRepository.findOne({ where: { id } });

    const result = await this.pointsRepository.findOne({
      where: { impUid },
    });

    if (!result) {
      throw new UnprocessableEntityException('존재하지 않는 결제건입니다.');
    }

    if (result.status === 'CANCEL') {
      throw new UnprocessableEntityException('이미 취소된 결제 건입니다.');
    }

    if (target.balance < result.amount) {
      throw new UnprocessableEntityException('환불이 불가능합니다.');
    }

    return { amount: result.amount, user: target };
  }
}
