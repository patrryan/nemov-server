import { InputType, PartialType } from '@nestjs/graphql';
import { CreateProductOptionInput } from './createProductOption.input';

@InputType()
export class UpdateProductOptionInput extends PartialType(
  CreateProductOptionInput,
) {}
