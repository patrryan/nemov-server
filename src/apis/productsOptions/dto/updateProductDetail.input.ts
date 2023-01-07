import { InputType, PartialType } from '@nestjs/graphql';
import { CreateProductOptionInput } from './createProductDetail.input';

@InputType()
export class UpdateProductOptionInput extends PartialType(
  CreateProductOptionInput,
) {}
