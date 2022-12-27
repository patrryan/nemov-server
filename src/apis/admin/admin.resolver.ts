import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AdminService } from './admin.service';
import { CreateAdminInput } from './dto/create-admin.input';
import { Admin } from './entities/admin.entity';

@Resolver()
export class AdminResolver {
  constructor(
    private readonly adminService: AdminService, //
  ) {}

  @Mutation(() => Admin)
  createAdmin(
    @Args('createAdminInput') createAdminInput: CreateAdminInput, //
  ): Promise<Admin> {
    return this.adminService.create({ createAdminInput });
  }
}
