var today = Date.now();
export class Coll {
    name: string;
    manager_names: string;
    manager_username: string;
    manager_contact: string;
    supervisor_names: string;
    supervisor_contact: string;
    supervisor_username: string;
    province: string;
    district: string;
    sector: string;
    stock: number;
    coll_id: number;
    date_created = today;
}