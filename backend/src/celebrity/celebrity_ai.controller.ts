import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import { PromptDto } from './dto/prompt.dto';
import { GoogleGenerativeAI } from '@google/generative-ai';

@ApiTags('Celebrity')
@Controller('celebrity')
export class CelebrityAiController {
  private readonly gemini: GoogleGenerativeAI;

  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not defined in environment variables');
    }

    this.gemini = new GoogleGenerativeAI(apiKey);
  }

  @Post('ai-suggest')
  @ApiOperation({ summary: 'Generate a celebrity profile using Gemini AI' })
  async suggest(@Body() body: PromptDto): Promise<any> {
    const dto = plainToInstance(PromptDto, body);
    const errors = validateSync(dto);

    if (errors.length) {
      throw new BadRequestException('Prompt is required and must be a string.');
    }

    const model = this.gemini.getGenerativeModel({ model: 'gemini-pro' });

    try {
      const result = await model.generateContent(`
        You are an assistant that returns celebrity profiles in strict JSON.
        Based on this prompt: "${dto.prompt}"
        Format the response exactly like:
        {
          "name": "Diljit Dosanjh",
          "category": "Singer",
          "country": "India",
          "imageUrl": "https://image.jpg",
          "instagram": "@diljit",
          "youtube": "https://youtube.com/c/diljit",
          "bio": "A Punjabi singer and actor who has performed internationally."
        }
      `);

      const text = result.response.text();

      try {
        return JSON.parse(text);
      } catch (err) {
        console.error('Gemini output not valid JSON:', text);
        throw new BadRequestException('AI did not return valid JSON.');
      }
    } catch (error) {
      console.error('Gemini API error:', error);
      throw new BadRequestException('Gemini API failed to generate a response.');
    }
  }
}
