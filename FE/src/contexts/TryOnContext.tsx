import { TryOnModelType } from '@/types/VirtualTryOnRequest';
import React, { createContext, useReducer, Dispatch } from 'react';


type State = {
  model_name: TryOnModelType;
  human_image:string;
  cloth_image:string;
};

type Action =
  | { type: 'SET_MODEL'; payload: TryOnModelType }
  | { type: 'SET_HUMAN_IMAGE'; payload: string }
  | { type: 'SET_CLOTHES_IMAGE'; payload: string };

const initialState: State = {
  model_name: 'kolors-virtual-try-on-v1-5',
  human_image:'',
  cloth_image:'',
};

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'SET_MODEL':
      return { ...state, model_name: action.payload };
    case 'SET_HUMAN_IMAGE':
      return {...state, human_image: action.payload };
    case 'SET_CLOTHES_IMAGE':
      return {...state, cloth_image: action.payload };
    default:
      return state;
  }
};

export const TryOnContext = createContext<{
  state: State;
  dispatch: Dispatch<Action>;
}>({
  state: initialState,
  dispatch: () => null
});

export const TryOnProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <TryOnContext.Provider value={{ state, dispatch }}>
      {children}
    </TryOnContext.Provider>
  );
};