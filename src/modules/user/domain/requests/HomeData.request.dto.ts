import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

export const HomeDataResponseSchema = z.object({
  id: z.number().int().positive().describe('ID do usuário'),
  username: z.string().max(50).describe('Nome do usuário'),
  score: z.number().int().positive().describe('Pontuação do usuário'),
});

export class HomeDataResponseDTO extends createZodDto(
  HomeDataResponseSchema,
) {}