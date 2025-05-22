import { PartialType } from '@nestjs/swagger';
import { CreateMessageTemplateDto } from './create-message-template.dto';
import { PickType } from '@nestjs/mapped-types';

export class UpdateMessageTemplateDto extends PartialType(PickType(CreateMessageTemplateDto, ['title','category','status','metadata']), { skipNullProperties: true}) {}
