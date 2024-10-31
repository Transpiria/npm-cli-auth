import { Error } from "./Error";

export interface UserLoginResponse {
    ok?: boolean;
    status?: number;
    id?: string;
    token?: string;
    message?: string;
    error?: string;
    errors?: Error[];
}
