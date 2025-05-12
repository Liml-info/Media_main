import React, { createContext, Dispatch, useReducer } from 'react';

interface FaceImgInfo {
  x: number,
  y: number,
  width: number,
  height: number,
  image: string,
}
type State = {
  FaceImgList: FaceImgInfo[],
  loading: boolean,
  zoom:number,
  selectedIndex:number,
  focuseIndex:number
};

export type FaceImgAction =
  { type: 'ADD_FACE_IMAGE'; payload: FaceImgInfo }
  | { type: 'DEL_FACEIMGLIST'; }
  | { type: 'SET_loading'; payload: boolean }
  | { type: "SER_Zoom"; payload: number }
  | { type: "SER_SelectedIndex"; payload: number }
  | { type: "SER_FocuseIndex"; payload: number }
  | { type: 'Init'; }
const initialState: State = {
 FaceImgList: [],
  loading: false,
  zoom: 1,
  selectedIndex:0,
  focuseIndex:-1,
};

const reducer = (state: State, action: FaceImgAction): State => {
  switch (action.type) {
    case 'ADD_FACE_IMAGE':
      return { ...state, FaceImgList: [...state.FaceImgList, action.payload] };
    case 'DEL_FACEIMGLIST':
      return { ...state, FaceImgList: [] };
    case 'SET_loading':
      return { ...state, loading: action.payload };
    case "SER_Zoom":
      return {...state, zoom: action.payload };
    case "SER_SelectedIndex":
      return {...state, selectedIndex: action.payload };
    case "SER_FocuseIndex":
      return {...state, focuseIndex: action.payload };
    case 'Init':
      return initialState;
    default:
      return state;
  }
};

export const FaceImgContext = createContext<{
  stateFaceImg: State;
  dispatchFaceImg: Dispatch<FaceImgAction>;
}>({
  stateFaceImg: initialState,
  dispatchFaceImg: () => null
});

export const FaceImgProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [stateFaceImg, dispatchFaceImg] = useReducer(reducer, initialState);
  return (
    <FaceImgContext.Provider value={{ stateFaceImg, dispatchFaceImg }}>
      {children}
    </FaceImgContext.Provider>
  );
};