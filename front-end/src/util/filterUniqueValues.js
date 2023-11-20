function filterUniqueValues (state, values) {
    const stateCopy = [...state];
    const stateId = stateCopy.map(a => a.id);
    const uniqueValues = values.filter(v => !stateId.includes(v.id));
    return uniqueValues;
}

export default filterUniqueValues;