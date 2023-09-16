export default abstract class DefaultRoute
{
    public abstract DatabaseInterface: null;
    public readonly abstract Method: string;
    public readonly abstract Path: string;
    public abstract Serve(request: any, response: any): void;
}