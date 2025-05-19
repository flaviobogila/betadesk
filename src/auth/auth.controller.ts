import { Controller, Post, Body, Patch, Param, BadRequestException, UseFilters } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UsersService } from 'src/users/users.service';
import { UpdateUserDto } from 'src/users/dto/update-user.dto';
import { UserRole } from 'src/common/enums/user-role.enum';
import { SignupDto } from './dto/signupDto';
import { SupabaseAuthExceptionFilter } from 'src/common/filters/supabase-auth-exception.filter';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UsersService) { }

  @Post('register')
  @UseFilters(new SupabaseAuthExceptionFilter)
  async register(@Body() registerDto: SignupDto) {

    const userAuth = await this.authService.registerUser(registerDto);
    const { user, tenant } = await this.userService.createUserAuth({ ...registerDto, userId: userAuth.user.id });
    await this.authService.updateMetadata(user.id, tenant.id, UserRole.admin)

    return { user, tenant };
  }

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Patch(':userId')
  update(@Param('userId') userId: string, @Body() dto: UpdateUserDto) {
    const { tenantId, role } = dto;
    return this.authService.updateMetadata(userId, tenantId!, role!);
  }
}
