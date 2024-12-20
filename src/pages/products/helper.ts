import { Product } from "../../types";

export const makeFormData = (data: Product)=> {
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
        if(key === 'image'){
            //do something
            formData.append(key, value.file);
        }else if(key === 'priceConfiguration' || key === 'attributes'){
            formData.append(key, JSON.stringify(value));
        }else {
            formData.append(key, value);
        }
    });

    return formData;

}