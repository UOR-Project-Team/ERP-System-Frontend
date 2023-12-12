
    
    export const validateusername = (username)=>{
        if(!username){
            return 'Username is required';
        }else{
            username = "";
        }
    }
    
    export const validatepassword = (password)=>{
        if(!password){
            return 'password is required';
        }else{
            return "";
        }
    }

    export const ValidateInput =(input)=>{
        if(!input){
            return "Field is required";
        }else{
            return "";
        }
    }
