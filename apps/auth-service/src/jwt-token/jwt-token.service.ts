import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/auth/entities/user.entity';

@Injectable()
export class JwtTokenService {
  constructor(private readonly jwtService: JwtService) {}

  generateToken(user: User): string {
    return this.jwtService.sign({
      sub: user.id,
      name: user.name,
      email: user.email,
    });
  }

  validateToken(token: string) {
    try {
      const decoded = this.jwtService.verify(token);
      return { valid: true, userId: decoded.sub };
    } catch (error) {
      console.error('Failed to decode token', error);
      return { valid: false, userId: null };
    }
  }
}
