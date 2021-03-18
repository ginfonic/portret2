import React, {useState} from "react";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText/ListItemText";

export default React.memo(function (props) {
    const {count} = props;

    return <div>
        <ListItem
            divider
            button
        >
            <ListItemText>
                В данном подразделении неправильная численность : {count}
                и нет сноски, разрешающей отклонение в численности.
            </ListItemText>
        </ListItem>
    </div>
})