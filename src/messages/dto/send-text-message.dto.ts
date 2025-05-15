import { IsString, IsNotEmpty, IsUUID, IsBoolean, IsOptional } from 'class-validator';
import { SendBaseMessageDto } from './send-base-message.dto';
import { ApiProperty } from '@nestjs/swagger';

export class SendTextMessageDto extends SendBaseMessageDto {
  @ApiProperty({ description: 'Conteúdo da mensagem', example: 'Olá, tudo bem?' })
  @IsString()
  @IsNotEmpty({ message: 'O conteúdo da mensagem não pode ser vazio.' })
  content: string;

  @ApiProperty({ description: 'Se a mensagem é privada ou não', default: false })
  @IsBoolean({ message: 'O campo isPrivate deve ser um booleano.' })
  @IsOptional()
  isPrivate?: string;

  @ApiProperty({ description: 'Id do usuário mencionado', example: 'e6106c10-00aa-4230-8b9d-23ea24267bd3' })
  @IsUUID(undefined, { message: 'O id do usuário a ser menncionado deve ser válido' })
  @IsOptional()
  mentionedUserId?: string;
}
