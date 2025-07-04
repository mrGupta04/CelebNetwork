import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { typeOrmConfig } from './config/typeorm.config';
import { CelebrityModule } from './celebrity/celebrity.module';
import { AuthModule } from './auth/auth.module';
import { FanModule } from './fan/fan.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot(typeOrmConfig),
    CelebrityModule,
    AuthModule,
    FanModule,
  ],
})
export class AppModule {}
