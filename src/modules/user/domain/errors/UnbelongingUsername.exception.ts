import { HttpException } from '@nestjs/common';

export class UnbelongingUsername extends HttpException {
  constructor() {
    super('O usuário informado não corresponde a nenhuma conta existente.', 404);
  }
}