// src/users/dto/update-user.dto.ts

import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';

// UpdateUserDto sẽ kế thừa tất cả các thuộc tính của CreateUserDto
// nhưng biến tất cả chúng thành tùy chọn (optional).
export class UpdateUserDto extends PartialType( CreateUserDto ) { }