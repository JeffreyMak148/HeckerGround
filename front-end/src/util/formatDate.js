import moment from "moment/moment";

function formatDate (date, dateString) {
    if(dateString) {
        return new Date(date).toLocaleDateString();
    }
    return moment(date).fromNow();
}

export default formatDate;