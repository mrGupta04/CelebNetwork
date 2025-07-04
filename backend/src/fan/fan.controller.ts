// src/fan/fan.controller.ts
import {
  Controller,
  Post,
  Delete,
  UseGuards,
  Req,
  Param,
  Get,
  Res,
} from '@nestjs/common';
import { FanService } from './fan.service';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { UserRole } from '../auth/user-role.enum';
import { Response } from 'express';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
} from '@nestjs/swagger';

@ApiTags('Fan')
@ApiBearerAuth()
@Controller('fan')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.FAN)
export class FanController {
  constructor(private readonly fanService: FanService) {}

  @Post('follow/:celebId')
  @ApiOperation({ summary: 'Follow a celebrity' })
  @ApiParam({ name: 'celebId', type: 'string' })
  async follow(@Req() req: any, @Param('celebId') celebId: string) {
    const fanId = req.user?.id;
    return this.fanService.follow(fanId, celebId);
  }

  @Delete('unfollow/:celebId')
  @ApiOperation({ summary: 'Unfollow a celebrity' })
  @ApiParam({ name: 'celebId', type: 'string' })
  async unfollow(@Req() req: any, @Param('celebId') celebId: string) {
    const fanId = req.user?.id;
    return this.fanService.unfollow(fanId, celebId);
  }

  @Get('my-celebrities')
  @ApiOperation({ summary: 'Get celebrities followed by the fan' })
  async getFollowed(@Req() req: any) {
    const fanId = req.user?.id;
    return this.fanService.getFollowedCelebrities(fanId);
  }

  @Get('all')
  @ApiOperation({ summary: 'Get all celebrities' })
  async getAllCelebrities() {
    return this.fanService.getAllCelebrities();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a celebrity profile by ID' })
  @ApiParam({ name: 'id', type: 'string' })
  async getCelebrity(@Param('id') id: string) {
    return this.fanService.getCelebrityById(id);
  }

  @Get('pdf/:id')
  @ApiOperation({ summary: 'Download celebrity profile as PDF' })
  @ApiParam({ name: 'id', type: 'string' })
  async downloadPdf(@Param('id') id: string, @Res() res: Response) {
    const buffer = await this.fanService.generatePdfForCelebrity(id);
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename=celebrity-${id}.pdf`,
    });
    res.end(buffer);
  }
}
