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


export const formatDateKor = (dateString) => {
  const parts = dateString.split('-');
  
  if (parts.length !== 3) {
    return NaN;
  }

  const day = parts[2];
  const month = parts[1] - 1;
  const year = parts[0];

  const date = new Date(year, month, day);

  if (isNaN(date)) {
    return NaN;
  }

  const formattedMonth = String(date.getMonth() + 1).padStart(2, '0');
  const formattedDay = String(date.getDate()).padStart(2, '0');
  const formattedYear = date.getFullYear();

  return `${formattedMonth}/${formattedDay}/${formattedYear}`;
};



export const formatDateToYYYYMMDD = (dateString) => {
    const date = new Date(dateString); 
  
    const day = date.getDate().toString().padStart(2, '0'); 
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); 
    const year = date.getFullYear();
  
    return `${year}-${month}-${day}`; 
  };

  export const formatDateTime = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); 
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    
    return `${year}-${month}-${day} ${hours}:${minutes}`; 
  };

  export const getLocalISOString = (date) => {
    if (!(date instanceof Date)) {
      date = new Date(date);
    }
    const timezoneOffset = date.getTimezoneOffset();
    const localDate = new Date(date.getTime() - timezoneOffset * 60000);
    const isoString = localDate.toISOString();
    return isoString.split('.')[0]; 
  };
  


  
  