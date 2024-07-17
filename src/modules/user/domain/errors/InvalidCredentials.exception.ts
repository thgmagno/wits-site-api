import { HttpException } from '@nestjs/common';

export class InvalidCredentials extends HttpException {
  constructor() {
    super('Usuário ou senha inválidos.', 400);
  }
}