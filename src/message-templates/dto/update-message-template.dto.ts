import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsObject, IsOptional, IsString, registerDecorator, ValidationArguments, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { TemplateCategory, TemplateStatus } from 'prisma/generated/prisma';

// Validador customizado
@ValidatorConstraint({ async: false })
class AtLeastOneFieldValidator implements ValidatorConstraintInterface {
  validate(_: any, args: ValidationArguments) {
    const object = args.object as any;
    return (
      object.title !== undefined ||
      object.category !== undefined ||
      object.status !== undefined
    );
  }

  defaultMessage(args: ValidationArguments) {
    return 'Pelo menos um dos campos (title, category, status) deve ser preenchido';
  }
}

function AtLeastOneField(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'atLeastOneField',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: AtLeastOneFieldValidator,
    });
  };
}

export class UpdateMessageTemplateDto {

    @ApiProperty({ description: 'Título visível para os usuários', example: 'Confirmação de Pedido' })
    @IsOptional()
    @IsString({ message: 'O título do template deve ser uma string' })
    @IsNotEmpty({ message: 'O título do template é obrigatório' })
    title?: string;

    @ApiProperty({ enum: TemplateCategory, description: 'Categoria do template', example: TemplateCategory.MARKETING })
    @IsOptional()
    @IsEnum(TemplateCategory, { message: 'Categoria inválida' })
    category?: TemplateCategory;

    @ApiProperty({ enum: TemplateStatus, description: 'Status inicial do template (opcional)', example: TemplateStatus.pending })
    @IsOptional()
    @IsEnum(TemplateStatus, { message: 'Status inválido' })
    status?: TemplateStatus;

    @ApiProperty({ enum: TemplateStatus, description: 'Razão da desaprovação do template', example: TemplateStatus.pending })
    @IsOptional()
    reason?: string;

    @ApiProperty({ description: 'Metadados adicionais (opcional)', example: { provedor: 'meta', namespace: 'abcd1234' }, required: false})
    @IsOptional()
    @IsObject({ message: 'Metadata deve ser um objeto JSON' })
    metadata?: Record<string, any>;

    @AtLeastOneField()
    dummyProperty?: any; 
}
