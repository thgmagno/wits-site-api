import { Injectable } from '@nestjs/common';
import { UserRepository } from '../repository/user.repository';
import { CreateUserRequestDTO, CreateUserResponseDTO } from '../domain/requests/CreateUser.request.dto';
import { UnprocessableDataException } from '../../../shared/domain/errors/UnprocessableData.exception';
import { EmailAlreadyRegisteredException } from '../domain/errors/EmailAlreadyRegistered.exception';
import { emailValidate } from '../../../shared/utils/email.validator';
import { passwordValidate } from '../../../shared/utils/password.validator';
import { JWTProvider } from '../providers/jwt.provider';
import { HashProvider } from '../providers/hash.provider';
import { nameValidate } from '../../../shared/utils/name.validator';

@Injectable()
export class UserService {
    constructor(
        private readonly userRepository: UserRepository,
        private jwtProvider: JWTProvider,
        private hashProvider: HashProvider,
    )   {}

    async register(credentials: CreateUserRequestDTO): Promise<CreateUserResponseDTO | EmailAlreadyRegisteredException | UnprocessableDataException>    {
        const userWithSameEmail = this.userRepository.findOne({ where: { email: credentials.email } })

        if (userWithSameEmail) return new EmailAlreadyRegisteredException();

        if (!nameValidate(credentials.username)) return new UnprocessableDataException('Nome inválido.');

        if (!emailValidate(credentials.email)) return new UnprocessableDataException('Email inválido.');

        if (!passwordValidate(credentials.password)) return new UnprocessableDataException('Senha inválida.');

        const user = await this.userRepository.create({
            username: credentials.username,
            email: credentials.email,
            password: await this.hashProvider.hash(credentials.password),
            role: 'common'
        })

        const token = this.jwtProvider.generate({
            payload: {
              id: user.id_user,
              role: 'common',
            },
          });

          const response = {
            user: {
                id: user.id_user,
                username: user.username,
                role: 'common',
            },
            token: token,
          };
    
          return response;
    }
}
