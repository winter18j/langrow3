import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { publicRoutes } from '../constants';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const { path, method } = request;

    // Check if the route is public
    const isPublic = publicRoutes.some(route => 
      path.endsWith(route.path) && route.method === method
    );

    if (isPublic) {
      return true;
    }

    return super.canActivate(context);
  }

  handleRequest(err: any, user: any, info: any, context: ExecutionContext) {
    if (err || !user) {
      throw err || new Error('Unauthorized');
    }
    
    // Attach the full user object to the request
    const request = context.switchToHttp().getRequest();
    request.user = user;
    
    return user;
  }
}