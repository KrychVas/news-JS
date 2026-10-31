/**
 * Environment variables injected at build time by `dotenv-webpack`.
 * Every key is optional here, because the build may run without a `.env` file
 * and fall back to `.env.defaults`.
 */
declare namespace NodeJS {
    interface ProcessEnv {
        readonly API_URL?: string;
        readonly API_KEY?: string;
        readonly API_USE_MOCKS?: string;
    }
}
