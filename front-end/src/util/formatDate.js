import moment from "moment/moment";

const formatDate = (date) => {
    return moment.utc(date).local().fromNow();
}

export const formatDateString = (date) => {
    return moment.utc(date).local().format("DD-MMM-YYYY");
}

export const formatFullDate = (date) => {
    return moment.utc(date).local().format("ddd, MMMM D YYYY, HH:mm:ss");
}

export default formatDate;