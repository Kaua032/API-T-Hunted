import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import databaseConfig from './config/database.config';
import { UsersModule } from './domains/users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [databaseConfig] }),
    TypeOrmModule.forRoot({
      imports: [ConfigModule],
      injects: [ConfigService],
      useFactory: (ConfigService: ConfigService) => configService.get('database'),
    }),
    UsersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
