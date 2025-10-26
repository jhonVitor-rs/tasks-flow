import { Module } from '@nestjs/common';
import { NotificationsClientController } from './notifications-client.controller';
import { NotificationsClientSocket } from './notifications-client.socket';
import { AuthClientModule } from 'src/auth-client/auth-client.module';

@Module({
  imports: [AuthClientModule],
  controllers: [NotificationsClientController],
  providers: [NotificationsClientSocket],
})
export class NotificationsClientModule {}
