import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Celebrity } from './celebrity.entity';
import { CreateCelebrityDto } from './dto/create-celebrity.dto';
import * as puppeteer from 'puppeteer';
import { GoogleGenerativeAI } from '@google/generative-ai';

@Injectable()
export class CelebrityService {
  private readonly gemini: GoogleGenerativeAI;

  constructor(
    @InjectRepository(Celebrity)
    private readonly celebrityRepo: Repository<Celebrity>,
  ) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new InternalServerErrorException(
        'GEMINI_API_KEY is not set in the environment.',
      );
    }
    this.gemini = new GoogleGenerativeAI(apiKey);
  }

  async create(data: CreateCelebrityDto) {
    const celeb = this.celebrityRepo.create(data);
    return this.celebrityRepo.save(celeb);
  }

  async findAll() {
    return this.celebrityRepo.find();
  }

  async getOne(id: string) {
    const celeb = await this.celebrityRepo.findOne({ where: { id } });
    if (!celeb) throw new NotFoundException('Celebrity not found');
    return celeb;
  }

  async generateFromPrompt(prompt: string) {
    const model = this.gemini.getGenerativeModel({ model: 'gemini-1.5-flash' });

    try {
      const result = await model.generateContent(`
        Return only valid JSON describing a celebrity. Format:
        {
          "name": "Diljit Dosanjh",
          "category": "Singer",
          "fanbase": 5000000,
          "country": "India",
          "instagram": "@diljitdosanjh",
          "imageUrl": "https://example.com/diljit.jpg",
          "setlist": "Do You Know, G.O.A.T, Born to Shine"
        }
        Based on this prompt: "${prompt}"
      `);

      const response = await result.response;
      const text = response.text();

      const cleanedText = text.replace(/```json|```/g, '').trim();

      try {
        return JSON.parse(cleanedText);
      } catch {
        console.error('Invalid JSON from Gemini:', cleanedText);
        throw new InternalServerErrorException('Gemini returned non-JSON output.');
      }
    } catch (error) {
      console.error('Gemini API error:', error);

      if (error.message.includes('429')) {
        throw new InternalServerErrorException('Rate limit exceeded. Please wait and try again.');
      }

      throw new InternalServerErrorException('Failed to generate data from Gemini.');
    }
  }

  async generatePDF(id: string) {
    const celeb = await this.celebrityRepo.findOne({ where: { id } });
    if (!celeb) throw new NotFoundException('Celebrity not found');

    const html = `
      <html>
        <body style="font-family:sans-serif;padding:20px;">
          <h1>${celeb.name}</h1>
          <p><strong>Category:</strong> ${celeb.category}</p>
          <p><strong>Fanbase:</strong> ${celeb.fanbase}</p>
          <p><strong>Country:</strong> ${celeb.country}</p>
          <p><strong>Instagram:</strong> ${celeb.instagram}</p>
          <p><strong>Setlist:</strong> ${celeb.setlist}</p>
        </body>
      </html>
    `;

    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.setContent(html);
    const pdf = await page.pdf({ format: 'A4' });
    await browser.close();
    return pdf;
  }

  async getCelebrityDashboard(id: string) {
    const celeb = await this.celebrityRepo.findOne({
      where: { id },
    });

    if (!celeb) {
      throw new NotFoundException('Celebrity not found');
    }

    return {
      fans: celeb.fanbase || 0,
      views: 124000, // mock or calculated
      interactions: 2500,
      events: 2,
    };
  }
}
