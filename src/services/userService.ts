import { AppDataSource } from '../config/data-source';
import { User } from '../entities/User';
import { NotFoundError, ConflictError } from '../utils/errors';
import bcrypt from 'bcrypt';
import { createLogger } from '../utils/logger';

const logger = createLogger('UserService');
const userRepository = AppDataSource.getRepository(User);

const ALLOWED_SORT_FIELDS = ['id', 'name', 'email', 'isActive', 'age', 'createdAt', 'updatedAt'] as const;
type SortField = (typeof ALLOWED_SORT_FIELDS)[number];

const publicUserSelect = {
    id: true,
    name: true,
    email: true,
    isActive: true,
    age: true,
    createdAt: true,
    updatedAt: true,
};

interface FindAllOptions {
    page: number;
    limit: number;
    sort: string;
    order: 'ASC' | 'DESC';
}

export interface CreateUserInput {
    name: string;
    email: string;
    password: string;
    age?: number;
}

export interface UpdateUserInput {
    name?: string;
    email?: string;
    password?: string;
    age?: number;
    isActive?: boolean;
}

function sanitizeUser(user: User): User {
    const { password: _password, ...safeUser } = user as User & { password?: string };
    return safeUser as User;
}

function isUniqueViolation(err: unknown): boolean {
    if (typeof err !== 'object' || err === null) return false;
    const code = (err as { code?: string; driverError?: { code?: string } }).code
        ?? (err as { driverError?: { code?: string } }).driverError?.code;
    return code === '23505' || code === 'ER_DUP_ENTRY';
}

export class UserService {
    static async findAll(options: FindAllOptions): Promise<[User[], number]> {
        const page = Math.max(1, options.page);
        const limit = Math.min(100, Math.max(1, options.limit));
        const sortField: SortField = (ALLOWED_SORT_FIELDS as readonly string[]).includes(options.sort)
            ? (options.sort as SortField)
            : 'id';
        const order = options.order === 'ASC' ? 'ASC' : 'DESC';
        const skip = (page - 1) * limit;

        return userRepository.findAndCount({
            select: publicUserSelect,
            order: { [sortField]: order },
            skip,
            take: limit,
        });
    }

    static async findById(id: number): Promise<User> {
        const user = await userRepository.findOne({
            where: { id },
            select: publicUserSelect,
        });

        if (!user) {
            throw new NotFoundError('User', id);
        }

        return user;
    }

    static async create(data: CreateUserInput): Promise<User> {
        const normalizedEmail = data.email.trim().toLowerCase();

        const existing = await userRepository.findOne({
            where: { email: normalizedEmail },
            select: { id: true },
        });

        if (existing) {
            throw new ConflictError('A user with this email already exists');
        }

        const hashedPassword = await bcrypt.hash(data.password, 10);

        const user = userRepository.create({
            name: data.name.trim(),
            email: normalizedEmail,
            password: hashedPassword,
            age: data.age,
        });

        try {
            const savedUser = await userRepository.save(user);
            logger.info('User created', { userId: savedUser.id });
            return sanitizeUser(savedUser);
        } catch (err) {
            if (isUniqueViolation(err)) {
                throw new ConflictError('A user with this email already exists');
            }
            throw err;
        }
    }

    static async update(id: number, data: UpdateUserInput): Promise<User> {
        const user = await userRepository.findOne({ where: { id } });

        if (!user) {
            throw new NotFoundError('User', id);
        }

        if (data.email !== undefined) {
            const normalizedEmail = data.email.trim().toLowerCase();
            if (normalizedEmail !== user.email) {
                const existing = await userRepository.findOne({
                    where: { email: normalizedEmail },
                    select: { id: true },
                });
                if (existing) {
                    throw new ConflictError('A user with this email already exists');
                }
                user.email = normalizedEmail;
            }
        }

        if (data.name !== undefined) {
            user.name = data.name.trim();
        }

        if (data.age !== undefined) {
            user.age = data.age;
        }

        if (data.isActive !== undefined) {
            user.isActive = data.isActive;
        }

        if (data.password !== undefined) {
            user.password = await bcrypt.hash(data.password, 10);
        }

        try {
            const updatedUser = await userRepository.save(user);
            logger.info('User updated', { userId: updatedUser.id });
            return sanitizeUser(updatedUser);
        } catch (err) {
            if (isUniqueViolation(err)) {
                throw new ConflictError('A user with this email already exists');
            }
            throw err;
        }
    }

    static async delete(id: number): Promise<void> {
        const user = await userRepository.findOne({ where: { id } });

        if (!user) {
            throw new NotFoundError('User', id);
        }

        await userRepository.remove(user);
        logger.info('User deleted', { userId: id });
    }
}