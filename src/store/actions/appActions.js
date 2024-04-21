import actionTypes from './actionTypes';

export const appStartUpComplete = () => ({
    type: actionTypes.APP_START_UP_COMPLETE
});

export const setContentOfConfirmModal = (contentOfConfirmModal) => ({
    type: actionTypes.SET_CONTENT_OF_CONFIRM_MODAL,
    contentOfConfirmModal: contentOfConfirmModal
});

export const appChangeLanguage = (language) => ({
    type: actionTypes.CHANGE_LANGUAGE,
    language: language
});

export const appChangeTheme = (theme) => ({
    type: actionTypes.CHANGE_THEME,
    theme: theme
});
