import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { TenantsController } from './tenants/tenants.controller';
import { TenantsModule } from './tenants/tenants.module';
import { UsersController } from './users/users.controller';
import { UsersService } from './users/users.service';
import { TenantsService } from './tenants/tenants.service';
import { AuthService } from './auth/auth.service';
import { AuthController } from './auth/auth.controller';

@Module({
  imports: [PrismaModule, UsersModule, TenantsModule],
  controllers: [AppController, UsersController, TenantsController, AuthController],
  providers: [AppService, UsersService, TenantsService, AuthService],
})
export class AppModule {}
