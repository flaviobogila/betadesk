import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { generateSlug } from 'src/common/utils/slug';
import { RegisterDto } from 'src/auth/dto/register.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  create(createUserDto: CreateUserDto) {
    return this.prisma.user.create({
      data: createUserDto,
    });
  }

  async createTenantWithAdminUser(createUserDto: RegisterDto) {

    return this.prisma.$transaction(async (tx) => {
      const { userId, companyName, fullName, email } = createUserDto;

      const tenant = await tx.tenant.create({
        data: { name: companyName, slug: generateSlug(companyName), isActive: true },
      });
    
      const user = await tx.user.create({
        data: {
          id:userId,
          tenantId: tenant.id,
          name: fullName,
          email,
          role: "admin",
        },
      });

      return { user, tenant };

    });
  }

  findAll(tenantId: string) {
    return this.prisma.user.findMany({
      where: { tenantId },
      orderBy: { name: 'asc' },
      include: {
        tenant: true,
      },
    });
  }

  findOne(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  findOneByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    return this.prisma.user.update({
      where: { id },
      data: updateUserDto,
    });
  }

  remove(id: string) {
    return this.prisma.user.delete({
      where: { id },
    });
  }
}
