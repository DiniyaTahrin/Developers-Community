import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CommentsModule } from './comments/comments.module';
import { PostsModule } from './posts/posts.module';
import { UsersModule } from './users/users.module';

import { AuthModule } from './auth/auth.module';
import { ReactionsModule } from './reactions/reactions.module';

import { APP_GUARD } from '@nestjs/core';
import { ThrottlerModule } from '@nestjs/throttler';
import { CustomThrottlerGuard } from './common/guards/custom-throttler.guard';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    // Connect to MongoDB
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URI'),
      }),
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60 * 60 * 1000, // 1 hour in ms
        limit: 10, // fallback: 10 requests per hour
      },
    ]),

    UsersModule,
    PostsModule,
    CommentsModule,
    AuthModule,
    ReactionsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: CustomThrottlerGuard, // make it the default throttler guard
    },
  ],
})
export class AppModule {}
