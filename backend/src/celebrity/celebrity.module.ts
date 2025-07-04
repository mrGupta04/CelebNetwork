import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Celebrity } from './celebrity.entity';
import { CelebrityService } from './celebrity.service';
import { CelebrityController } from './celebrity.controller';
import { CelebrityAiController } from './celebrity_ai.controller';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from '../auth/auth.module'; 

@Module({
  imports: [
    TypeOrmModule.forFeature([Celebrity]),
    ConfigModule,
    AuthModule,
  ],
  providers: [CelebrityService],
  controllers: [CelebrityController, CelebrityAiController],
  exports: [CelebrityService],
})
export class CelebrityModule {}
