import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm'; // <-- Adicionei o TypeOrmModuleOptions
import { ConfigModule, ConfigService } from '@nestjs/config';
import databaseConfig from './config/database.config';
import { UsersModule } from './domains/users/users.module';
import { AuthModule } from './domains/auth/auth.module';
import { CarsModule } from './domains/cars/cars.module';
import { CollectionsModule } from './domains/collections/collections.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [databaseConfig] }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => 
        configService.get<TypeOrmModuleOptions>('database') as TypeOrmModuleOptions, 
    }),
    UsersModule,
    AuthModule,
    CarsModule,
    CollectionsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}