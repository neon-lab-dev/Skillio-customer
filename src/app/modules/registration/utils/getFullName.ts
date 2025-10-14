export const getFullName= (firstName:string , lastName:string):string=>{
    const fullName= `${firstName} ${lastName}`;
    return fullName.trim();
}