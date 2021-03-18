import React from "react";
import Menu from "@material-ui/core/Menu/Menu";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon/ListItemIcon";
import {FilterList} from "@material-ui/icons";
import ListItemText from "@material-ui/core/ListItemText";

export default React.forwardRef(function FilterElem(props, ref) {
    const {name,
        filter,
        filter_array,
        setFilter,
        setChosen,
        setAnchorEl,
        filterAnchor,
        setFilterAnchor,
        setAdd,
        id} = props;

    const handleLvlFilter = (event) => {
        setFilterAnchor(event.currentTarget)
    };

    const handleLvlFilterClose = () => {
        setFilterAnchor(null);
        setAnchorEl(null);
    };

    const addFilter = (item) => () => {
        if (filter.indexOf(item) === -1) {
            const new_filter = [...filter];
            new_filter.push(item);

            setAnchorEl(null);
            setFilterAnchor(null);
            if (id === 'etalon_menu') setAdd(false);
            setFilter(new_filter);

            if (setChosen) setChosen(null);
        }
    };

    const menu_array = filter_array.map((item) => <ListItem
            selected={filter.indexOf(item) !== -1}
            button onClick={addFilter(item)}
            key={item}
            value={item}>
            {item}
        </ListItem>);

    return <div ref={ref}>
        <ListItem
            button onClick={handleLvlFilter}
            key={name}
            value={name}>
            <ListItemIcon>
                <FilterList/>
            </ListItemIcon>
            <ListItemText primary={name}/>
        </ListItem>
        <Menu
            anchorEl={filterAnchor}
            open={Boolean(filterAnchor)}
            onClose={handleLvlFilterClose}
        >
            {menu_array}
        </Menu>
    </div>
})