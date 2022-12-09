const initialState = {
  address: "",
  balance: "",
  network: ""
};

const wallet = (state = initialState, action) => {
  switch (action.type) {
    case "UPDATE_WALLET":
      let updatedValues = action.payload
      console.log(updatedValues)
      return { ...state, ...updatedValues };
    default:
      return state;
  }
};

export default wallet;
