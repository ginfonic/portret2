const initialState = {
    user: false,
    descriptionModal: false,
    devModal: null,
    settingModal: false,
    colorMain: false,
    colorEx: false,
    count: 'state',
    date: false,
    noteInfo: false,
    showColors: false,
    etalonModal: false,
    vsp: false,
    etalonCount:{type:false, deps:[]},
    etalonObj: false,
    errorReportModal: false
};

export  function mainReducer (state = initialState, action) {
    switch(action.type){
        case 'SET_AUTH':
            return {...state, user: action.payload.user.user, colorMain: action.payload.colorMain, colorEx: action.payload.colorEx, date: action.payload.date };
        case 'SET_DESCRIPTIONMODAL':
            return {...state, descriptionModal: action.payload };
        case 'SET_DEV_MODAL':
            return {...state, devModal: action.payload };
        case 'SET_ERROR_REPORT_MODAL':
            return {...state, errorReportModal: action.payload};
        case 'SET_SETTINGMODAL':
            return {...state, settingModal: action.payload };
        case 'SET_SETCOUNT':
            return {...state, count: action.payload };
        case 'SET_NOTEINFO':
            return {...state, noteInfo: action.payload };
        case 'SET_SHOWCOLORINFO':
            return {...state, showColors: action.payload };
        case 'SET_ETALONMODAL':
            return {...state, etalonModal: action.payload };
        case 'SET_VSP':
            return {...state, vsp: action.payload };
        case 'SET_ETALONCOUNT':
            return{...state, etalonCount: action.payload};
        case 'SET_ETALONOBJ':
            return{...state, etalonObj: action.payload};
        case 'SET_DATE':
            return{...state, date: action.payload};
        //Def action    
        default:
            return state;
    }
}