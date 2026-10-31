/**
 * `style-loader` turns every imported stylesheet into a plain string at build
 * time, so the module only has a default export.
 */
declare module '*.css' {
    const content: string;
    export default content;
}
