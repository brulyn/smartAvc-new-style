var today = Date.now();
export class Farmer {
         first_name: string;
         last_name: string;
         national_id: number;
         province: string;
         district: string;
         sector: string;
         phone_number_mtn: string= "078";
         phone_number_airtel: string="073";
         phone_number_tigo: string="072";
         gender: string;
         age: number;
         married: string;
         farm_width: number;
         date_deposit = today;
         stock: number;
         updating_stock: boolean; 
         category: string = "";   
}