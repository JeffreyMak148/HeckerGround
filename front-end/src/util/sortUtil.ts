function sortUtil(property: string) {
    var sortOrder = 1;
    if(property[0] === "-") {
        sortOrder = -1;
        property = property.substr(1);
    }
    if(property === 'createDateTime') {
        return function (a: any,b: any) {
            var result = (Date.parse(a[property]) < Date.parse(b[property])) ? -1 : (Date.parse(a[property]) > Date.parse(b[property])) ? 1 : 0;
            return result * sortOrder;
        }
    }

    return function (a: any,b: any) {
        var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
        return result * sortOrder;
    }
}

export const flipSortOrder = (order: string): string => {
    return order === "asc" ? "desc" : "asc";
}

export default sortUtil;