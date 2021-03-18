 const rowsPerPageCalc = function (length) {
    //Looks awful but i don't want to waste too much time
    let array = [];

    if (length > 5) array.push(5);
    else {
        array.push(length);
        return array
    }
    if (length > 10) array.push(10);
    else {
        array.push(length);
        return array
    }
    if (length > 15) array.push(15);
    else {
        array.push(length);
        return array
    }
    if (length > 30) array.push(30);
    else {
        array.push(length);
        return array
    }
    if (length > 50) array.push(50);
    else {
        array.push(length);
        return array
    }
    if (length > 100) array.push(100);
    else {
        array.push(length);
        return array
    }
    if (length > 150) array.push(150);
    else {
        array.push(length);
        return array
    }
    return array
};

function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

export {rowsPerPageCalc, descendingComparator}