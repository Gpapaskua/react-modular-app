type IAction =
  | { type: "OPEN_EDIT_NAME_MODAL"; groupId: string; name: string }
  | { type: "CLOSE_EDIT_NAME_MODAL" }
  | {
      type: "OPEN_EDIT_DESCRIPTION_MODAL";
      groupId: string;
      description: string;
    }
  | { type: "CLOSE_EDIT_DESCRIPTION_MODAL" }
  | { type: "OPEN_ADD_PARAMETER_MODAL"; groupId: string }
  | { type: "CLOSE_ADD_PARAMETER_MODAL" };

interface IModalState {
  isOpen: boolean;
  groupId: string;
}

interface IEditNameModalState extends IModalState {
  name: string;
}

interface IEditDescriptionModalState extends IModalState {
  description: string;
}

interface IState {
  editNameModal: IEditNameModalState;
  editDescriptionModal: IEditDescriptionModalState;
  addParameterModal: IModalState;
}

export const initialState: IState = {
  editNameModal: { isOpen: false, groupId: "", name: "" },
  editDescriptionModal: { isOpen: false, groupId: "", description: "" },
  addParameterModal: { isOpen: false, groupId: "" },
};

export const reducer = (state: IState, action: IAction) => {
  switch (action.type) {
    case "OPEN_EDIT_NAME_MODAL":
      return {
        ...state,
        editNameModal: {
          isOpen: true,
          groupId: action.groupId,
          name: action.name,
        },
      };
    case "CLOSE_EDIT_NAME_MODAL":
      return {
        ...state,
        editNameModal: { ...state.editNameModal, isOpen: false },
      };
    case "OPEN_EDIT_DESCRIPTION_MODAL":
      return {
        ...state,
        editDescriptionModal: {
          isOpen: true,
          groupId: action.groupId,
          description: action.description,
        },
      };
    case "CLOSE_EDIT_DESCRIPTION_MODAL":
      return {
        ...state,
        editDescriptionModal: { ...state.editDescriptionModal, isOpen: false },
      };
    case "OPEN_ADD_PARAMETER_MODAL":
      return {
        ...state,
        addParameterModal: { isOpen: true, groupId: action.groupId },
      };
    case "CLOSE_ADD_PARAMETER_MODAL":
      return {
        ...state,
        addParameterModal: { ...state.addParameterModal, isOpen: false },
      };
    default:
      return state;
  }
};
