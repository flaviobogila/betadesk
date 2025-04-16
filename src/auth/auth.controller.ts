import { Controller, Post, Body, Patch, Param } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UpdateDto } from './dto/update.dto';
import { TenantsService } from 'src/tenants/tenants.service';
import { generateSlug } from 'src/common/utils/slug';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService, private readonly tenantsService: TenantsService) {}

  @Post('signUp')
  async signUp(@Body() dto: RegisterDto) {
    const { companyName } = dto;
    const tenantDto = { name: companyName, slug: generateSlug(companyName) }
    const tenant = await this.tenantsService.create(tenantDto);
    if (!tenant) {
      throw new Error('Falha ao criar a empresa relacionada a conta do usuário.');
    }

    return this.authService.register({...dto, tenantId: tenant.id});
  }

  @Patch(':userId')
  update(@Param('userId') userId: string, @Body() dto: UpdateDto) {
    return this.authService.update(userId, dto);
  }

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }
}
