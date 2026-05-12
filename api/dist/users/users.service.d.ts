import { PrismaService } from '../prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
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
    findOne(id: number): Promise<{
        password: string;
        email: string;
        id: number;
        name: string;
        role: import("@prisma/client").$Enums.Role;
        dataCriacao: Date;
    } | null>;
    update(id: number, updateUserDto: UpdateUserDto): Promise<{
        email: string;
        id: number;
        name: string;
        role: import("@prisma/client").$Enums.Role;
        dataCriacao: Date;
    }>;
    remove(id: number): Promise<void>;
}
