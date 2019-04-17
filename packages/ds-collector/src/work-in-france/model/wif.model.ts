import { DSData } from "../../demarche-simplifiee";

export interface WIFRecord<T extends DSData> {
    id?: string;
    ds_key: string;
    ds_data: T;
}
