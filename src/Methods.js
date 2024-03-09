export const formattedDate = (dateString) => {
    const options = {
        hour: 'numeric',
        minute: 'numeric',
        day: 'numeric',
        month: 'numeric',
        year: 'numeric'
    };
    return new Date(dateString).toLocaleString('es-ES', options);
};

export const checkToken = ()=>{
    const token = localStorage.getItem("token");
        if (!token) {
            
            return false;
        }
        return true;
};