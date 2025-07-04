import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Res,
  HttpStatus,
  NotFoundException,
  ParseUUIDPipe,
} from '@nestjs/common';
import { CelebrityService } from './celebrity.service';
import { Response } from 'express';
import { CreateCelebrityDto } from './dto/create-celebrity.dto';
import { ApiTags, ApiOperation, ApiParam } from '@nestjs/swagger';
import { AuthService } from '../auth/auth.service'; // ✅ Import AuthService

@ApiTags('Celebrity')
@Controller('celebrity')
export class CelebrityController {
  constructor(
    private readonly celebrityService: CelebrityService,
    private readonly authService: AuthService, // ✅ Inject AuthService
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new celebrity profile' })
  async create(@Body() body: CreateCelebrityDto) {
    const celebrity = await this.celebrityService.create(body);

    // ✅ Generate a JWT token using the celebrity ID and email
    const token = this.authService.generateToken({
      sub: celebrity.id,
      email: celebrity.email,
      role: 'CELEBRITY',
    });

    return {
      id: celebrity.id,
      token,
    };
  }

  @Get()
  @ApiOperation({ summary: 'Get all celebrity profiles' })
  getAll() {
    return this.celebrityService.findAll();
  }

  @Get('dashboard/:userId')
  @ApiOperation({ summary: 'Get celebrity dashboard stats' })
  @ApiParam({ name: 'userId', type: 'string' })
  getDashboard(@Param('userId') userId: string) {
    return this.celebrityService.getCelebrityDashboard(userId);
  }

  @Get('pdf/:id')
  @ApiOperation({ summary: 'Download celebrity profile as PDF' })
  @ApiParam({ name: 'id', type: 'string' })
  async getPDF(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Res() res: Response
  ) {
    try {
      const pdfBuffer = await this.celebrityService.generatePDF(id);
      res.set({
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename=celebrity-${id}.pdf`,
      });
      return res.status(HttpStatus.OK).send(pdfBuffer);
    } catch (error) {
      console.error('PDF Generation Error:', error);
      throw new NotFoundException('Celebrity PDF could not be generated');
    }
  }

  @Post('generateFromPrompt')
  @ApiOperation({ summary: 'Generate celebrity data from AI prompt' })
  generateFromPrompt(@Body() body: { prompt: string }) {
    return this.celebrityService.generateFromPrompt(body.prompt);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a celebrity by ID' })
  @ApiParam({ name: 'id', type: 'string' })
  getOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.celebrityService.getOne(id);
  }
}
