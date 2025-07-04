import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FanService } from './fan.service';
import { FanController } from './fan.controller';
import { FanFollow } from './fan.entity';
import { Celebrity } from '../celebrity/celebrity.entity';
import { User } from '../auth/user.entity';
import { JwtStrategy } from '../auth/jwt.strategy'; // If needed
import { JwtModule } from '@nestjs/jwt';
TypeOrmModule.forFeature([FanFollow, Celebrity, User])


@Module({
  imports: [
    TypeOrmModule.forFeature([FanFollow, Celebrity, User]),
    JwtModule.register({}), // Optional: only if you inject JwtService
  ],
  controllers: [FanController],
  providers: [FanService, JwtStrategy], // Add JwtStrategy if your controller uses @UseGuards
})
export class FanModule {}
