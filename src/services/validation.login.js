 export const validateusername = (username)=>{
    if(!username){
        return 'Username is required *';
    }else{
        return "fghg";
    }
}
    
export const validatepassword = (password)=>{
    if(!password){
        return 'Password is required *';
    }else{
        return "fghg";
    }
}

export const ValidateInput =(input)=>{
    if(!input){
        return "This field is required";
    }else{
        return "";
    }
}
