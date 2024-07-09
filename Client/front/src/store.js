import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';

// Reducers
const initialFormData = {
  name: '',
  phone: '',
  email: '',
  area: '',
  city: '',
  state: '',
  postCode: '',
};

const formDataReducer = (state = initialFormData, action) => {
  switch (action.type) {
    case 'UPDATE_FORM_DATA':
      return {
        ...state,
        [action.payload.name]: action.payload.value,
      };
    case 'RESET_FORM_DATA':
      return initialFormData;
    default:
      return state;
  }
};

const stationDataReducer = (state = null, action) => {
  switch (action.type) {
    case 'SET_STATION_DATA':
      return action.payload;
    default:
      return state;
  }
};

const rootReducer = combineReducers({
  formData: formDataReducer,
  stationData: stationDataReducer,
});

// Store
const store = createStore(rootReducer, applyMiddleware(thunk));

export default store;
