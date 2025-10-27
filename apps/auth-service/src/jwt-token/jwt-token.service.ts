import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/auth/entities/user.entity';

@Injectable()
export class JwtTokenService {
  constructor(private readonly jwtService: JwtService) {}

  generateToken(user: User): string {
    const token = this.jwtService.sign({
      sub: user.id,
      name: user.name,
      email: user.email,
    });

    return token;
  }

  validateToken(token: string) {
    try {
      if (!token) {
        return { valid: false, userId: null };
      }

      if (typeof token !== 'string') {
        return { valid: false, userId: null };
      }

      const cleanToken = token.replace(/^Bearer\s+/i, '').trim();

      const parts = cleanToken.split('.');
      if (parts.length !== 3) {
        return { valid: false, userId: null };
      }

      const decoded = this.jwtService.verify(cleanToken);

      return { valid: true, userId: decoded.sub };
    } catch (error) {
      console.error('Failed to decode token', error);
      return { valid: false, userId: null };
    }
  }
}
