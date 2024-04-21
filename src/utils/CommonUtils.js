import moment from 'moment';

class CommonUtils {
    static isNumber1 (number) {
        if (number === 1) return true;
        return false;
    }

    static getBase64(file) {
        return new Promise((resolve,reject)=> {
            const reader = new FileReader()
            reader.readAsDataURL(file)
            reader.onload = () => resolve(reader.result)
            reader.onerror = (error) => reject(error)
        })
    }

    // static getDate(Value,date)  {
    //     const regex = /(\d{1,2}):(\d{2})\s*-\s*(\d{1,2}):(\d{2})(\w{0,2})/;
    //     const valueString = Value.match(regex);
        
    //     if (valueString && valueString.length === 6) {
    //         const [_, startHour1, startMinute1] = valueString;
            
    //         const startDate = `${startHour1}:${startMinute1}`;
            
    //         const currentDate = new Date();
    //         const currentDay = moment().format('YYYY-MM-DD');
    //         const currentHour = currentDate.getHours();
    //         const currentMinute = currentDate.getMinutes();

    //         const startHour = parseInt(startHour1, 10);
    //         const startMinute = parseInt(startMinute1, 10);

    //         if(date === currentDay) {
    //             if (startHour < currentHour || (startHour === currentHour && startMinute < currentMinute)) {
    //                 return true
    //             } else {
    //                 return false;
    //             }
    //         }
    //         else {
    //             return false
    //         }
    //     }
        
    //     return false; 
    // };
}

export default CommonUtils;