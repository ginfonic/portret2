import React from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import Typography from "@material-ui/core/Typography";

export default React.memo(function (props) {
    const {user, open, setOpen} = props;

    return <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth={"xl"}
    >
        <DialogContent>
            <Typography style={{whiteSpace: 'pre-wrap'}}>
                {user}
            </Typography>
        </DialogContent>
    </Dialog>
})