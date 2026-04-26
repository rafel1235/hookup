import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ProfileModule } from './profile/profile.module';
import { PostModule } from './post/post.module';
import { JobAdModule } from './job-ad/job-ad.module';
import { FollowModule } from './follow/follow.module';

@Module({
  imports: [
    AuthModule, // Deve essere qui!
    ProfileModule,
    PostModule,
    JobAdModule,
    FollowModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
