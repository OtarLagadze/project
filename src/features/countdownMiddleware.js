import { tickCountdown, updateStarted } from './userSlice';

let intervalId = null;

const countdownMiddleware = ({ dispatch, getState }) => next => action => {
  if (action.type === 'user/updateStarted') {
    const { started } = getState().user;
    if (started) {
      intervalId = setInterval(() => {
        dispatch(tickCountdown());
      }, 1000);
    } else {
      clearInterval(intervalId);
    }
  } else if (action.type === 'user/resetCountdown') {
    clearInterval(intervalId);
  }
  return next(action);
};

export default countdownMiddleware;
