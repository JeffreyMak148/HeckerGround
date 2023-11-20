import moment from "moment/moment";

function formatFullDate (date) {
    return moment(date).format("ddd, MMMM D YYYY, HH:mm:ss");
}

export default formatFullDate;