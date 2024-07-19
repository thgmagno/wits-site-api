import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

export const FindCoursesResponseSchema = z.object({
  id_course: z.number().int().positive().describe('ID do Curso'),
  course_name: z.string().max(50).describe('Nome do usuário'),
  points_worth: z.number().int().positive().describe('Total de Pontos do Curso'),
  total_of_activities: z.number().int().positive().describe('Total de Atividades no Curso'),
  created_at: z.date().describe('Data de Lançamento'),
});

export class FindCoursesResponseDTO extends createZodDto(
  FindCoursesResponseSchema,
) {}