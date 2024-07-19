import {
  Controller,
  Get,
  HttpException,
  Param,
  Req,
  Res,
} from '@nestjs/common';
import { CourseService } from '../services/course.service';
import {
  FindCoursesResponseDTO,
  FindIndividualCourseResponseDTO,
} from '../domain/requests/FindCourses.request.dto';
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { NotAuthenticatedException } from '../../../shared/domain/errors/NotAuthenticated.exception';
import { AllExceptionsFilterDTO } from '../../../shared/domain/dtos/errors/AllException.filter.dto';
import { CommonException } from '../../../shared/domain/errors/Common.exception';
import { Request, Response } from 'express';
import { CourseNotFoundException } from '../domain/errors/CourseNotFound.exception';

@Controller('courses')
export class ConjunctCoursesController {
  constructor(private readonly courseService: CourseService) {}

  @Get('browse')
  @ApiBearerAuth('user-token')
  @ApiResponse({
    status: 200,
    description: 'Cursos trazidos com sucesso.',
    type: FindCoursesResponseDTO,
  })
  @ApiResponse({
    status: new NotAuthenticatedException().getStatus(),
    description: new NotAuthenticatedException().message,
    type: AllExceptionsFilterDTO,
  })
  @ApiResponse({
    status: new CommonException().getStatus(),
    description: new CommonException().message,
    type: AllExceptionsFilterDTO,
  })
  async browse(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<FindCoursesResponseDTO[] | AllExceptionsFilterDTO> {
    const user = req.user;

    if (!user) {
      return res.status(new NotAuthenticatedException().getStatus()).json({
        message: new NotAuthenticatedException().message,
        status: new NotAuthenticatedException().getStatus(),
      });
    }

    const result = await this.courseService.getCourses();

    if (result instanceof HttpException) {
      return res.status(result.getStatus()).json({
        message: result.message,
        status: result.getStatus(),
      });
    } else {
      return res.status(200).json(result);
    }
  }
}

@Controller('course')
export class IndividualCoursesController {
  constructor(private readonly courseService: CourseService) {}

  @Get(':course_id/info')
  @ApiBearerAuth('user-token')
  @ApiResponse({
    status: 200,
    description: 'Dados do curso trazidos com sucesso.',
    type: FindIndividualCourseResponseDTO,
  })
  @ApiResponse({
    status: new NotAuthenticatedException().getStatus(),
    description: new NotAuthenticatedException().message,
    type: AllExceptionsFilterDTO,
  })
  @ApiResponse({
    status: new CourseNotFoundException().getStatus(),
    description: new CourseNotFoundException().message,
    type: AllExceptionsFilterDTO,
  })
  @ApiResponse({
    status: new CommonException().getStatus(),
    description: new CommonException().message,
    type: AllExceptionsFilterDTO,
  })
  async findCourse(
    @Param('course_id') courseId: number,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<FindIndividualCourseResponseDTO | AllExceptionsFilterDTO> {
    const user = req.user;

    if (!user) {
      return res.status(new NotAuthenticatedException().getStatus()).json({
        message: new NotAuthenticatedException().message,
        status: new NotAuthenticatedException().getStatus(),
      });
    }

    const result = await this.courseService.getCourseData(user.id, courseId);

    if (result instanceof HttpException) {
      return res.status(result.getStatus()).json({
        message: result.message,
        status: result.getStatus(),
      });
    } else {
      return res.status(200).json(result);
    }
  }
}
