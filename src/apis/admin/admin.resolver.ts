import { Args, Resolver } from '@nestjs/graphql';
import { AdminService } from './admin.service';
import { CreateAdminInput } from './dto/create-admin.input';

@Resolver()
export class AdminResolver {
  constructor(
    private readonly adminService: AdminService, //
  ) {}

  createAdmin(
    @Args('createAdminInput') createAdminInput: CreateAdminInput, //
  ) {
    return this.adminService.create({ createAdminInput });
  }
}
