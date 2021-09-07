import { AxiosError } from 'axios';
import api from 'adapters/xhr';

export type UUID = string
interface UserBase {
    userId: UUID;
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string | null;
}

type IsoDateString = string
interface UserJson extends UserBase {
    created: IsoDateString;
    modified: IsoDateString;
}

export interface UserResponse extends UserBase {
    created: Date;
    modified: Date;
}

export type UserPost = Omit<UserBase, 'userId'>;

export type UserUpdate = Omit<Partial<UserBase>, 'userId'>;

export interface UsersPagination {
    totalCount: number;
    page?: number;
    pageSize?: number;
    before?: Date;
    users: UserResponse[];
}

export interface UnknownUserErrorResponse { }

export interface UserErrorResponse {
    status: number;
    error: string;
    message: string;
    details?: {
        cause?: string[];
    };
}

export function isUserErrorResponse(
    response: UserErrorResponse | UnknownUserErrorResponse | null
): response is UserErrorResponse {
    const userErrorResponse = response as UserErrorResponse;
    return userErrorResponse.status !== undefined &&
        userErrorResponse.error !== undefined &&
        userErrorResponse.message !== undefined;
}

function convertIsoDateTimeStringToDate(isoDateString: IsoDateString): Date {
    const timestamp = Date.parse(isoDateString ?? '');
    if (Number.isNaN(timestamp)) {
        return new Date();
    }
    return new Date(timestamp);
}

function convertJsonToUser(userJson: UserJson): UserResponse {
    return {
        ...userJson,
        created: convertIsoDateTimeStringToDate(userJson.created),
        modified: convertIsoDateTimeStringToDate(userJson.modified),
    }
}

export async function getUsers(page?: number, pageSize?: number, before?: Date): Promise<UsersPagination> {
    try {
        page = page !== undefined ? page + 1 : page;
        const response = await api.get('/users/', {
            params: {
                page,
                pageSize,
                before: before?.toISOString()
            }
        });

        const totalCount: number = parseInt(response.headers['x-total-count']);
        const usersJson: UserJson[] = response.data.users;
        const users = usersJson.map(convertJsonToUser);

        return {
            totalCount,
            page,
            pageSize,
            before,
            users
        };
    } catch (error) {
        return {
            totalCount: 0,
            users: []
        };
    }
}

export async function getUser(id: UUID): Promise<UserResponse | null> {
    try {
        const response = await api.get(`/users/${id}`);
        const user: UserJson = response.data.user;
        return convertJsonToUser(user);
    } catch (error) {
        return null;
    }
}

export async function postUser(
    userPost: UserPost
): Promise<UserErrorResponse | UnknownUserErrorResponse | null> {
    try {
        await api.post('/users/', userPost);
        return null;
    } catch (error) {
        const err = error as AxiosError;
        const response = err.response;
        
        if (!response) return {} as UnknownUserErrorResponse;

        return response.data as UserErrorResponse
    }
}

export async function updateUser(
    id: UUID,
    userUpdate: UserUpdate
): Promise<UserErrorResponse | UnknownUserErrorResponse | null> {
    try {
        await api.put(`/users/${id}`, userUpdate);
        return null;
    } catch (error) {
        const err = error as AxiosError;
        const response = err.response;

        if (!response) return {} as UnknownUserErrorResponse;

        return response.data as UserErrorResponse
    }
}

export async function deleteUser(id: UUID): Promise<boolean> {
    try {
        await api.delete(`/users/${id}`);
        return true;
    } catch (error) {
        return false;
    }
}
