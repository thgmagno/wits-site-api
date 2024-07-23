import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserScoreService } from '../services/user-score.service';

@Controller('scores')
@ApiTags('Placar de Usuários')
export class ConjunctUserScoreController {
    constructor(
        private readonly userScoreService: UserScoreService,
    ) {}
}

@Controller('score')
@ApiTags('Placar de Usuários')
export class IndividualUserScoreController {}