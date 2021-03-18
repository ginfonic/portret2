function recursive_fill_final(search_elem, array) {
    for (let index in array) {
        if (array[index].elem) {
            if (array[index].elem.id === search_elem.parentid) {
                array[index].array.push(search_elem);
                return array
            }
            else if (array[index].elem.parentid === search_elem.id) {
                array[index] = {elem: search_elem, array: [array[index]]};
                let splice = [];
                for (let ind in array) {
                    if (array[ind].elem) {
                        if (array[ind].elem.parentid === array[index].elem.id) {
                            array[index].array.push(array[ind]);
                            splice.push(Number(ind))
                        }
                    }
                    if (array[ind].parentid === array[index].elem.id) {
                        array[index].array.push(array[ind]);
                        splice.push(Number(ind))
                    }
                }
                array = array.filter((el, inde) => splice.indexOf(inde) === -1);
                return array
            }
            else {
                let tmp_array = recursive_fill_final(search_elem, array[index].array);
                if (tmp_array !== null) {
                    array[index].array = tmp_array;
                    return array
                }
            }
        }
        if (array[index].id === search_elem.parentid) {
            array[index] = {elem: array[index], array: [search_elem]};
            return array
        }
        if (array[index].parentid === search_elem.id) {
            array[index] = {elem: search_elem, array: [array[index]]};
            return array
        }
    }
    return null
}

module.exports = {
    recursive_fill_final
};