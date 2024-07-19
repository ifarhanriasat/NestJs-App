import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ConfigurationModule } from './config/config.module';
import { GadgetsModule } from './/gedgets/gedgets.module';
import { DatabaseModule } from './database/database.module';
import { LoggingMiddleware } from './middleware/logging.middleware';
import { AppService } from './app.service';
import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';


@Module({
  imports: [
    UsersModule,
    GadgetsModule,
    AuthModule,
    DatabaseModule,
    ConfigurationModule,
  ],
  controllers: [],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggingMiddleware).forRoutes('*');
  }
}
