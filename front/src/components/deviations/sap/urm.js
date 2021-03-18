import React, {useState} from "react";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText/ListItemText";

export default React.memo(function (props) {
    return <div>
        <ListItem
            divider
            button
        >
            <ListItemText>
                В данном подразделении присутствует УРМ, хотя нет сноски, подтверждающей наличие урма.
            </ListItemText>
        </ListItem>
    </div>
})