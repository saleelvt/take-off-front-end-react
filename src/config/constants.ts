

export const URL="http://localhost:2002"; 
// export const URL="https://api.takeoffbusinessnetwork.com";


 export const createAxiosConfig = (isFileUpload = false) => ({
    headers: {
        "Content-Type": isFileUpload ? "multipart/form-data" : "application/json",
    },
    withCredentials: true,
});

export const config ={
    headers :{
        "Content-Type": "application/json",
    },
    withCredentials:true
}