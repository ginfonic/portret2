import React from 'react';
import FootModal from '../footNote/footModal';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemText from '@material-ui/core/ListItemText';
import SettingsIcon from '@material-ui/icons/Settings';
import ColorReadactor from './colorPart/colorRedactor';
import PrecountModal from '../precountModal/precountModal';
import {useSelector, useDispatch} from 'react-redux';
import { SetShowColors } from '../../redux/actions';
import { history } from '../../index';
const StyledMenu = withStyles({
    paper: {
        border: '1px solid #d3d4d5',
    },
})((props) => (
    <Menu
        elevation={0}
        getContentAnchorEl={null}
        anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
        }}
        transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
        }}
        {...props}
    />
));

const StyledMenuItem = withStyles((theme) => ({
    root: {
        '&:focus': {
            backgroundColor: theme.palette.primary.main,
            '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
                color: theme.palette.common.white,
            },
        },
    },
}))(MenuItem);

export default function CustomizedMenus(props) {
    const { type } = props;
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [footModal, setFootModal] = React.useState(false);
    const [countModal, setCountModal] = React.useState(false);
    const [openColorRedactor, setOpenColorRedactor] = React.useState(false);
    const dispatch = useDispatch();
    const showColor = useSelector(state => state.mainReducer.showColors);
    const user = useSelector(state => state.mainReducer.user);
    const stabUnits = new Set([17,14,1,2,3,4,5,6,7,8]);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };
    const handleModal = () => {
        setFootModal(true)
    }
    const handleHistory = () => {
        history.push(`${process.env.REACT_APP_BASE}/match`)
    }

    const handleColor = (showColor) => {
        dispatch(SetShowColors(showColor))
    }
    return (
        <div>
            <Button
                aria-controls="customized-menu"
                aria-haspopup="true"
                color="primary"
                startIcon={<SettingsIcon />}
                onClick={handleClick}
            >
                Управление Типовой структурой
      </Button>
            <StyledMenu
                id="customized-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                {user.role.id === 17 &&
                    <StyledMenuItem onClick={handleModal}>
                        <ListItemText primary="Управление сносками" />
                    </StyledMenuItem>
                }
                {user.role.id === 17 &&
                    <StyledMenuItem onClick={() => setOpenColorRedactor(true)}>
                        <ListItemText primary="Открыть редактор категорий должностей" />
                    </StyledMenuItem>
                }
                {stabUnits.has(user.role.id) &&
                    <StyledMenuItem onClick={() => setCountModal(true)}>
                        <ListItemText primary="Отобразить численность" />
                    </StyledMenuItem>
                }

                <StyledMenuItem onClick={() => handleColor(showColor)}>
                    <ListItemText primary={showColor ? "Скрыть категории должностей" : "Отразить категории должностей" }/>
                </StyledMenuItem>
                {user.role.id === 17 &&
                    <StyledMenuItem onClick={handleHistory}>
                        <ListItemText primary="Перейти к сравнению" />
                    </StyledMenuItem>
                }
            </StyledMenu>
            {footModal && <FootModal setFootModal={setFootModal} />}
            { openColorRedactor && <ColorReadactor  openColorRedactor={openColorRedactor} setOpenColorRedactor={setOpenColorRedactor}/>}
            {countModal && <PrecountModal countModal={countModal} setCountModal={setCountModal} type={type}/>}
        </div>
    );
}
