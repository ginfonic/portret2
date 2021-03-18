import React from 'react';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import { Grid } from '@material-ui/core/';
import { makeStyles } from '@material-ui/core/styles';
import { history } from '../../index';
import Axios from "axios";

const useStyles = makeStyles((theme) => ({
       breadItem: {
        cursor: 'pointer'
       }
    
}));

export default function BreadCrumb(props){
    const classes = useStyles();
    const {
        dep,
        depName,
        depId,
        setDepId
    } = props;

    const [parents, setParents] = React.useState({id: null, parent: null, type: 'tb', depname: ''});

    React.useEffect(() => {
        Axios.post('deptree/bread_parent', {depId}).then((res => {
            setParents(res.data.parents);
            console.log(res.data.parents);
        }));
    }, []);

    const linkToDepName =()=>{
        history.push(`${process.env.REACT_APP_BASE}/dep/${depName}`)
    };

    const linkToDep=()=>{
        history.push(`${process.env.REACT_APP_BASE}/dep/${depName}/${dep}`)
    };

    const linkToParent = (id, type) => {
        if (type === 'tb') {
            history.push(`${process.env.REACT_APP_BASE}/deptree/${depName}/${id}`);
            setDepId(id)
        }
        else {
            history.push(`${process.env.REACT_APP_BASE}/deptree/${depName}/${dep}/${id}`);
            setDepId(id)
        }
    };

    const fill_parent_chips = (parents) => {
        if (parents.id === null) {
            return []
        }
        else {
            return [<span className={classes.breadItem} onClick={() => {linkToParent(parents.id, parents.type)}}>
                    {parents.depname}
                </span>,
                ...fill_parent_chips(parents.parent)]
        }
    };

    const parent_array = fill_parent_chips(parents).reverse();

    return(
        <Grid container xs={12} justify='center'>
            <Grid item>
            <Breadcrumbs aria-label="breadcrumb">
                <span className={classes.breadItem} onClick={linkToDepName}>
                    {depName}
                </span>
                {dep &&
                    <span className={classes.breadItem} onClick={linkToDep}>
                        {dep}
                    </span>
                }
                {parent_array}
            </Breadcrumbs>
            </Grid>
        </Grid>
    )
}