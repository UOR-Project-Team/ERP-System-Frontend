
    
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
