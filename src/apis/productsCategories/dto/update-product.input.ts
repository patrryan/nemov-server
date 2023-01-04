import { InputType, PartialType } from '@nestjs/graphql';
import { CreateProductCategoryInput } from './create-product.input';

@InputType()
export class UpdateProductCategoryInput extends PartialType(
  CreateProductCategoryInput,
) {}
