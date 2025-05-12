import React, { createContext, useReducer, Dispatch } from 'react';

type State = {
  model_name: string;
  mode: string;
  duration: string;
  cfg_scale: number;
  prompt: string;
  negative_prompt: string;
  image:string;
  image_tail:string;
  uploadedFiles: File[];
};

type Action =
  | { type: 'SET_MODEL'; payload: string }
  | { type: 'SET_QUALITY'; payload: string }
  | { type: 'SET_DURATION'; payload: string }
  | { type: 'SET_CFG_SCALE'; payload: number }
  | { type: 'SET_PROMPT'; payload: string }
  | { type: 'SET_NEGATIVE_PROMPT'; payload: string }
  | { type: 'SET_IMAGE'; payload: string }
  | { type: 'SET_IMAGE_TAIL'; payload: string }
  | { type: 'SET_UPLOADED_FILES'; payload: File[] };

const initialState: State = {
  model_name: 'kling-v1-6',
  mode: 'std',
  duration: '5',
  cfg_scale: 0.5,
  prompt: '',
  negative_prompt: '',
  image:'',
  image_tail:'',
  uploadedFiles: []
};

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'SET_MODEL':
      return { ...state, model_name: action.payload };
    case 'SET_QUALITY':
      return { ...state, mode: action.payload };
    case 'SET_DURATION':
      return { ...state, duration: action.payload };
    case 'SET_CFG_SCALE':
      return { ...state, cfg_scale: action.payload };
    case 'SET_PROMPT':
      return { ...state, prompt: action.payload };
    case 'SET_NEGATIVE_PROMPT':
      return { ...state, negative_prompt: action.payload };
    case 'SET_IMAGE':
      return {...state, image: action.payload };
    case 'SET_IMAGE_TAIL':
      return {...state, image_tail: action.payload };
    case 'SET_UPLOADED_FILES':
      return { ...state, uploadedFiles: action.payload };
    default:
      return state;
  }
};

export const VideoContext = createContext<{
  state: State;
  dispatch: Dispatch<Action>;
}>({
  state: initialState,
  dispatch: () => null
});

export const VideoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <VideoContext.Provider value={{ state, dispatch }}>
      {children}
    </VideoContext.Provider>
  );
};