import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  UseGuards,
  Req,
  NotFoundException,
  Patch,
} from '@nestjs/common';
import { CreateChannelDto } from './dto/create-channel.dto';
import { SupabaseAuthGuard } from 'src/auth/supabase-auth.guard';
import { Request } from 'express';
import { ChannelsService } from './channels.service';
import { UpdateChannelDto } from './dto/update-channel.dto';

@Controller('channels')
@UseGuards(SupabaseAuthGuard)
export class ChannelsController {
  constructor(private readonly channelService: ChannelsService) {}

  @Post()
  async create(@Body() dto: CreateChannelDto) {
    const { tenantId } = dto;

    if (!tenantId) {
      throw new NotFoundException('Tenant não encontrado no token.');
    }

    return this.channelService.createChannel(dto, tenantId);
  }

  @Get()
  async findAll(@Req() req: any) {
    const tenantId = req.user?.user_metadata?.tenant_id;
    return this.channelService.getAllChannels(tenantId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Req() req: any) {
    const tenantId = req.user?.user_metadata?.tenant_id;
    return this.channelService.getByIdAndValidateTenant(id, tenantId);
  }

   @Patch(':id')
    update(@Param('id') id: string, @Body() updateTenantDto: UpdateChannelDto) {
      return this.channelService.update(id, updateTenantDto);
    }
}
