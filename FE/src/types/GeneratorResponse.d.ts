export interface GeneratorResponseType {
    code: string;
    message: string;
    data: DataDataType;
}

interface DataDataType {
    task_id:string;
    task_status:string;
    created_at:number;
    updated_at:number;
}