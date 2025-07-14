// src/users/users.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService
{
  constructor (
    @InjectRepository( User )
    private usersRepository: Repository<User>,
  ) { }

  async create ( createUserDto: CreateUserDto ): Promise<User>
  {
    const newUser = this.usersRepository.create( createUserDto );
    return this.usersRepository.save( newUser );
  }

  async findAll (): Promise<User[]>
  {
    return this.usersRepository.find();
  }

  async findOne ( id: string ): Promise<User>
  {
    const user = await this.usersRepository.findOne( { where: { id } as any } );
    if ( !user )
    {
      throw new NotFoundException( `User with ID ${ id } not found` );
    }
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);
    Object.assign(user, updateUserDto);
    return this.usersRepository.save(user);
  }

  async remove(id: string): Promise<void> {
    const result = await this.usersRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
  }

  async findOneByEmail ( email: string ): Promise<User | null>
  {
    return this.usersRepository
      .createQueryBuilder( 'user' )
      .where( 'user.email = :email', { email } )
      .addSelect( 'user.password' )
      .getOne();
  }
}