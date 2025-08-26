export interface AuthResponse {
    success: boolean
    message: string
    user?: any
    session?: any
    error?: string
}
export interface SignUpData {
    email: string
    password: string
    firstName?: string
    lastName?: string
}
export interface SignInData {
    email: string
    password: string
}
export interface UpdateUserData {
    id: string
    password?: string
    firstName?: string
    lastName?: string
}
