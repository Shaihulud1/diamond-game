import { Catch, ExceptionFilter, ArgumentsHost } from '@nestjs/common';
import { Socket } from 'socket.io';

@Catch()
export class WsExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    // TODO: разделить ошибки
    const ctx = host.switchToWs();
    const client = ctx.getClient<Socket>();

    let message = 'An unknown error has occurred.';

    if (exception instanceof Error) {
      message = exception.message;
    }
    client.emit('exception', { message });
  }
}
