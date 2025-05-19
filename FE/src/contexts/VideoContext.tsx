import React, { createContext, useReducer, Dispatch } from 'react';
export type inputType = "text" | "image";
export type ModelName = 'kling-v1' |'kling-v1-5'| 'kling-v1-6' | 'kling-v2-master';
export type AspectRatio = '16:9' | '9:16' | '1:1';
export type Mode = 'std' | 'pro';
export type Duration = '5' | '10';
export type InputImageType = 'firstend' | 'mulitple' ;
export type ImageListItem = { image: string; };
type State = {
  model_name: ModelName;
  input_type: inputType;
  input_image_type:InputImageType;
  mode: Mode;
  duration: Duration;
  cfg_scale: number;
  prompt: string;
  negative_prompt: string;
  image:string;
  image_tail:string;
  aspect_ratio:AspectRatio;
  image_list: ImageListItem[];
};

type Action =
  | { type: 'SET_MODELNAME'; payload: ModelName }
  | { type: 'SET_MODEL'; payload: Mode }
  | { type: 'SET_INPUT_IMAGE_TYPE'; payload: InputImageType }
  | { type: 'SET_INPUT_TYPE'; payload: inputType }
  | { type: 'SET_DURATION'; payload: Duration }
  | { type: 'SET_CFG_SCALE'; payload: number }
  | { type: 'SET_PROMPT'; payload: string }
  | { type: 'SET_NEGATIVE_PROMPT'; payload: string }
  | { type: 'SET_IMAGE'; payload: string }
  | { type: 'SET_IMAGE_TAIL'; payload: string }
  | { type: 'SET_IMAGE_LIST'; payload: ImageListItem[] }
  | { type: 'SET_ASPECT_RATIO'; payload: AspectRatio };

const initialState: State = {
  model_name: 'kling-v1-6',
  input_type: "image",
  mode: 'std',
  duration: '5',
  cfg_scale: 0.5,
  prompt: '',
  negative_prompt: '',
  image:'',
  image_tail:'',
  aspect_ratio:'16:9',
  input_image_type:'firstend',
  image_list:[]
};

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'SET_MODELNAME':
      return { ...state, model_name: action.payload };
    case 'SET_MODEL':
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
    case 'SET_INPUT_TYPE':
      return {...state, input_type: action.payload };
    case 'SET_INPUT_IMAGE_TYPE':
      return {...state, input_image_type: action.payload };
    case 'SET_ASPECT_RATIO':
      return {...state, aspect_ratio: action.payload };
    case 'SET_IMAGE_LIST':
      return {...state, image_list: action.payload };
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