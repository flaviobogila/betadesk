import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { JsonValue } from '@prisma/client/runtime/library';
import { IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import { LogType } from 'prisma/generated/prisma';

export class CreateConversationLogDto {
    @ApiProperty({
        description: 'ID da conversa relacionada ao log',
        example: 'e4f61d9b-3c5a-4b58-9c78-2c9c9c3e4fbc',
    })
    @IsUUID()
    conversationId: string;

    @ApiProperty({
        description: 'Tipo de alteração registrada no log',
        enum: LogType,
    })
    @IsEnum(LogType)
    type: LogType;

    @ApiPropertyOptional({
        description: 'Valor anterior da propriedade alterada (ex: status anterior)',
        example: 'waiting',
    })
    @IsOptional()
    @IsString()
    from?: string;

    @ApiPropertyOptional({
        description: 'Novo valor da propriedade alterada (ex: novo status)',
        example: 'in_progress',
    })
    @IsOptional()
    @IsString()
    to?: string;

    @ApiPropertyOptional({
        description: 'ID do usuário ou sistema que realizou a ação',
        example: 'fae3c6d9-1bfc-4b9c-944b-7c8fae2d5c55',
    })
    @IsOptional()
    @IsUUID()
    performedBy?: string;

    @ApiPropertyOptional({
        description: 'Comentário opcional sobre o log (observação adicional)',
        example: 'Status alterado automaticamente após resposta do cliente',
    })
    @IsOptional()
    @IsString()
    comment?: string;

    @ApiPropertyOptional({
        description: 'Metadado adicional sobre o log (ex: ID do cliente, ID do agente)',
        example: '{ userId: "12345", agentId: "67890" }',
    })
    @IsOptional()
    @IsString()
    metadata?: any;
}
