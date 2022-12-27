import { InputType, OmitType } from '@nestjs/graphql';
import { Admin } from '../entities/admin.entity';

@InputType()
export class CreateAdminInput extends OmitType(Admin, ['id'], InputType) {}
