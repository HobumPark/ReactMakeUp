export const formatDateToDDMMYYYY = (dateString) => {
    const date = new Date(dateString); 
  
    const day = date.getDate().toString().padStart(2, '0'); 
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); 
    const year = date.getFullYear();
  
    return `${day}/${month}/${year}`;
  };


  export const formatDateToMMDDYYYY = (dateString) => {
    const date = new Date(dateString); 
  
    const day = date.getDate().toString().padStart(2, '0'); 
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); 
    const year = date.getFullYear();
  
    return `${month}/${day}/${year}`;
  };


export const formatDateToYYYYMMDD = (dateString) => {
    const date = new Date(dateString); 
  
    const day = date.getDate().toString().padStart(2, '0'); 
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); 
    const year = date.getFullYear();
  
    return `${year}-${month}-${day}`; 
  };