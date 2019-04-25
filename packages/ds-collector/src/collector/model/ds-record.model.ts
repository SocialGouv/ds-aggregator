import { IIdentifiable } from "../../util";

export interface DSRecord<T extends IIdentifiable> {
    id?: string;
    ds_key: string;
    ds_data: T;
}
