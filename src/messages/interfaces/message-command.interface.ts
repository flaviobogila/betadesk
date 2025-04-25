export interface IMessageCommand {
    execute(dto: any): Promise<any>;
}