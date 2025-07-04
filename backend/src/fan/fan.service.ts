import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FanFollow } from './fan.entity';
import { Celebrity } from '../celebrity/celebrity.entity';
import { User } from '../auth/user.entity';
import * as puppeteer from 'puppeteer';

@Injectable()
export class FanService {
  constructor(
    @InjectRepository(FanFollow)
    private readonly followRepo: Repository<FanFollow>,

    @InjectRepository(Celebrity)
    private readonly celebRepo: Repository<Celebrity>,

    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async follow(fanId: number, celebId: string) {
    // Check if celebrity exists
    const celebrity = await this.celebRepo.findOne({ where: { id: celebId } });
    if (!celebrity) throw new NotFoundException('Celebrity not found');

    // Check if fan user exists
    const fan = await this.userRepo.findOne({ where: { id: fanId } });
    if (!fan) throw new NotFoundException('Fan user not found');

    // Check if already following
    const existing = await this.followRepo.findOne({
      where: { fanId, celebrityId: celebId },
    });

    if (existing) {
      return { message: 'Already following this celebrity.' };
    }

    // Save new follow
    const follow = this.followRepo.create({
      fan,
      fanId,
      celebrity,
      celebrityId: celebId,
    });

    return this.followRepo.save(follow);
  }

  async unfollow(fanId: number, celebId: string) {
    const existing = await this.followRepo.findOne({
      where: { fanId, celebrityId: celebId },
    });

    if (!existing) {
      throw new BadRequestException('You are not following this celebrity.');
    }

    await this.followRepo.remove(existing);
    return { message: 'Unfollowed successfully.' };
  }

  async getFollowedCelebrities(fanId: number) {
    const follows = await this.followRepo.find({
      where: { fanId },
      relations: ['celebrity'],
    });

    return follows.map((follow) => {
      const celeb = follow.celebrity;
      return {
        id: celeb.id,
        name: celeb.name,
        category: celeb.category,
        imageUrl: celeb.imageUrl,
        lastActivity: 'Recently followed',
      };
    });
  }

  async getAllCelebrities() {
    return this.celebRepo.find();
  }

  async getCelebrityById(id: string) {
    const celeb = await this.celebRepo.findOne({ where: { id } });
    if (!celeb) throw new NotFoundException('Celebrity not found');
    return celeb;
  }

  async generatePdfForCelebrity(id: string): Promise<Buffer> {
    const celeb = await this.getCelebrityById(id);
    if (!celeb) throw new NotFoundException('Celebrity not found');

    const htmlContent = `
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h1 { color: #4B0082; }
            p { margin-bottom: 10px; }
          </style>
        </head>
        <body>
          <h1>${celeb.name}</h1>
          <p><strong>Category:</strong> ${celeb.category}</p>
          <p><strong>Country:</strong> ${celeb.country}</p>
          <p><strong>Instagram:</strong> ${celeb.instagram || 'N/A'}</p>
          <p><strong>YouTube:</strong> ${celeb.youtube || 'N/A'}</p>
          <p><strong>Fanbase:</strong> ${celeb.fanbase.toLocaleString()}</p>
          <p><strong>Setlist:</strong> ${celeb.setlist || 'Not available'}</p>
        </body>
      </html>
    `;

    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.setContent(htmlContent);
    const pdfBuffer = await page.pdf({ format: 'A4' });
    await browser.close();

    return Buffer.from(pdfBuffer);
  }
}
