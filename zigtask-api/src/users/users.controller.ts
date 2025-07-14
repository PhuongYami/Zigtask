// src/users/users.controller.ts
import
  {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
    ParseUUIDPipe,
    HttpCode,
    HttpStatus,
  } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

// Trong một ứng dụng thực tế, bạn sẽ có thêm một RolesGuard ở đây
// import { RolesGuard } from '../auth/guards/roles.guard';
// import { Roles } from '../auth/decorators/roles.decorator';
// import { UserRole } from './user-role.enum';

@ApiBearerAuth()
@ApiTags( 'Users (Admin-like endpoints)' ) // Ghi chú để người dùng Swagger hiểu rõ hơn
@Controller( 'users' )
@UseGuards( AuthGuard('jwt') ) // Bảo vệ tất cả các endpoint trong controller này với JWT strategy
export class UsersController
{
  constructor ( private readonly usersService: UsersService ) { }

  /**
   * Endpoint này thường chỉ dành cho Admin.
   * Nó không được sử dụng trong luồng đăng ký thông thường.
   */
  @Post()
  @ApiOperation( {
    summary: 'Create a new user (Admin only)',
    description: 'This endpoint is typically restricted to administrators.',
  } )
  @ApiResponse( { status: 201, description: 'User created successfully.' } )
  @ApiResponse( { status: 403, description: 'Forbidden resource.' } ) // Lỗi nếu có RolesGuard
  create ( @Body() createUserDto: CreateUserDto )
  {
    // Lưu ý: usersService.create() cần được điều chỉnh lại nếu bạn dùng endpoint này,
    // vì hiện tại nó đang nhận SignUpDto. Đây là một ví dụ về sự khác biệt.
    // return this.usersService.create(createUserDto);
    return 'This endpoint is a placeholder for admin user creation.';
  }

  @Get()
  @ApiOperation( { summary: 'Get all users (Admin only)' } )
  findAll ()
  {
    return this.usersService.findAll();
  }

  @Get( ':id' )
  @ApiOperation( { summary: 'Get a single user by ID (Admin only)' } )
  findOne ( @Param( 'id', ParseUUIDPipe ) id: string )
  {
    return this.usersService.findOneById( id );
  }

  @Patch( ':id' )
  @ApiOperation( { summary: 'Update a user by ID (Admin or owner)' } )
  update (
    @Param( 'id', ParseUUIDPipe ) id: string,
    @Body() updateUserDto: UpdateUserDto,
  )
  {
    return this.usersService.update( id, updateUserDto );
  }

  @Delete( ':id' )
  @HttpCode( HttpStatus.NO_CONTENT )
  @ApiOperation( { summary: 'Delete a user by ID (Admin only)' } )
  remove ( @Param( 'id', ParseUUIDPipe ) id: string )
  {
    return this.usersService.remove( id );
  }
}