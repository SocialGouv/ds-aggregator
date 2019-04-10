import { demarcheSimplifieeAPI } from "./api";

demarcheSimplifieeAPI.getProcedure(9407).subscribe((val) => {
    console.log(val);
})