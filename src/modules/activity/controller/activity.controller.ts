import { Body, Controller, HttpException, Post, Req, Res } from '@nestjs/common';
import { ActivityService } from '../services/activity.service';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateActivityRequestDTO, CreateActivityResponseDTO } from '../domain/requests/CreateActivity.request.dto';
import { NotAuthenticatedException } from '../../../shared/domain/errors/NotAuthenticated.exception';
import { CourseNotFoundException } from '../../course/domain/errors/CourseNotFound.exception';
import { CommonException } from '../../../shared/domain/errors/Common.exception';
import { Request, Response } from 'express';
import { AllExceptionsFilterDTO } from '../../../shared/domain/dtos/errors/AllException.filter.dto';
import { NoPermisionException } from '../../../shared/domain/errors/NoPermission.exception';

@Controller('activity')
@ApiTags('Atividades do Curso')
export class ActivityController {
    constructor(
        private readonly activityService: ActivityService,
    ) {}

    @Post('create')
    @ApiBearerAuth('user-token')
    @ApiResponse({
        status: 201,
        description: 'Atividade criada com sucesso.',
        type: CreateActivityResponseDTO,
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
      async createActivity(
        @Body() createActivityRequestDTO: CreateActivityRequestDTO,
        @Req() req: Request,
        @Res() res: Response,
      ): Promise<CreateActivityResponseDTO | AllExceptionsFilterDTO> {
        const user = req.user;
    
        if (!user || user.role !== 'admin')
            return res.status(new NoPermisionException().getStatus()).json({
              message: new NoPermisionException().message,
              status: new NoPermisionException().getStatus(),
            });
    
        const result = await this.activityService.createActivity(createActivityRequestDTO);

        if (result instanceof HttpException) {
            return res.status(result.getStatus()).json({
              message: result.message,
              status: result.getStatus(),
            });
          } else {
            return res.status(201).json(result);
          }
      }
}
