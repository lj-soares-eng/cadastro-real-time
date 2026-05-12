import type { Request, Response } from 'express';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
type AuthedRequest = Request & {
    user: {
        userId: number;
        email: string;
        name: string;
        role: import('@prisma/client').Role;
    };
};
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    create(createUserDto: CreateUserDto): Promise<{
        email: string;
        id: number;
        name: string;
        role: import("@prisma/client").$Enums.Role;
        dataCriacao: Date;
    }>;
    findAll(): Promise<{
        password: string;
        email: string;
        id: number;
        name: string;
        role: import("@prisma/client").$Enums.Role;
        dataCriacao: Date;
    }[]>;
    findOne(id: string): Promise<{
        password: string;
        email: string;
        id: number;
        name: string;
        role: import("@prisma/client").$Enums.Role;
        dataCriacao: Date;
    } | null>;
    update(id: number, updateUserDto: UpdateUserDto, req: AuthedRequest): Promise<{
        email: string;
        id: number;
        name: string;
        role: import("@prisma/client").$Enums.Role;
        dataCriacao: Date;
    }>;
    remove(id: number, req: AuthedRequest, res: Response): Promise<void>;
}
export {};
