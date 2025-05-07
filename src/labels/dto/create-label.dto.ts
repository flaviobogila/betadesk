export class CreateLabelDto {
    id?: string;
    name: string;
    color: string;
    tenantId: string;
    createdAt?: Date;
    createdById?: string;
}
