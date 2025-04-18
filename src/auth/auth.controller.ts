import { Controller, Post, Body, Patch, Param, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UsersService } from 'src/users/users.service';
import { UserRole } from 'src/users/dto/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UsersService) { }

  @Post('signUp')
  async signUp(@Body() dto: RegisterDto) {

    try {
      const authUser = await this.authService.register({ ...dto });
      const { user, tenant } = await this.userService.createTenantWithAdminUser({...dto, userId: authUser.user.id});
      await this.authService.update(user.id, tenant.id, UserRole.admin)

      return { user, tenant};

    } catch (error) {
      throw new BadRequestException(error.message);
    }

  }

  @Patch(':userId')
  update(@Param('userId') userId: string, @Body() dto: { tenantId: string, role: string }) {
    const { tenantId, role } = dto;
    return this.authService.update(userId, tenantId, role);
  }

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }
}
