import React, { createContext, Dispatch, useReducer } from 'react';

interface ValueType<T> {
  value: T;
  show: boolean;
}
type ReferenceType = 'subject' | 'face' | 'bgReference';
export type ModelType = 'kling-v1-5' | 'kling-v1';
export  type ImageAspectRatioType = '16:9' | '9:16' | '1:1' | '4:3' | '3:4' | '3:2' | '2:3' | '21:9';
interface FaceImgInfo {
  x: number,
  y: number,
  width: number,
  height: number,
  image: string,
}
type State = {
  model_name: ModelType;
  prompt: ValueType<string>;
  negative_prompt: ValueType<string>;
  image_reference: ValueType<ReferenceType>;
  image: ValueType<string>;
  subject: {
    image_fidelity: number;
    human_fidelity: number;
  },
  face: {
    faceImg: string;
    image_fidelity: number;
  },
  bgReference: {
    image_fidelity: number;
  }
  n: ValueType<string>;
  aspect_ratio: ValueType<ImageAspectRatioType>;
};

export type PictureAction =
  | { type: 'SET_MODEL'; payload: ModelType }
  | { type: 'SET_PROMPT'; payload: string }
  | { type: 'SET_NEGATIVE_PROMPT'; payload: string }
  | { type: 'SET_IMAGE'; payload: string }
  | { type: 'SET_IMAGE_REFERENCE'; payload: ReferenceType }
  | { type: 'SET_SUBJECT_IMAGE_FIDELITY'; payload: number }
  | { type: 'SET_SUBJECT_HUMAN_FIDELITY'; payload: number }
  | { type: 'SET_FACE_IMAGE_FIDELITY'; payload: number }
  | { type: 'SET_FACE_IMAGE'; payload: string }
  | { type: 'SET_BGREF_IMAGE_FIDELITY'; payload: number }
  | { type: 'SET_N'; payload: string }
  | { type: 'SET_ASPECT_RATIO'; payload: ImageAspectRatioType };

const initialState: State = {
  model_name: 'kling-v1-5',
  prompt: {
    value: '',
    show: true
  },
  negative_prompt: {
    value: '',
    show: true
  },
  image: {
    value: '',
    show: true
  },
  image_reference: {
    value: 'subject',
    show: true
  },
  subject: {
    image_fidelity: 45,
    human_fidelity: 45
  },
  face: {
    faceImg: "",
    image_fidelity: 45
  },
  bgReference: {
    image_fidelity: 45
  },
  n: {
    value: '4',
    show: true
  },
  aspect_ratio: {
    value: '9:16',
    show: true
  }
};

const reducer = (state: State, action: PictureAction): State => {
  switch (action.type) {
    case 'SET_MODEL':
      {
        const tmpStateValue = { ...state, model_name: action.payload };
        if (action.payload === "kling-v1-5") {
          if (tmpStateValue.image_reference.value === "bgReference") {
            tmpStateValue.image_reference.value = "subject";
          }
        } else {

          if (tmpStateValue.image_reference.value !== "bgReference") {
            tmpStateValue.image_reference.value = "bgReference";
          }
        }

        return tmpStateValue;
      }
    case 'SET_PROMPT':
      return { ...state, prompt: { value: action.payload, show: state.prompt.show } };
    case 'SET_NEGATIVE_PROMPT':
      return { ...state, negative_prompt: { value: action.payload, show: state.negative_prompt.show } };
    case 'SET_IMAGE':
      const tmpNegativePrompt = { ...state.negative_prompt };
      if (action.payload === "") {
        tmpNegativePrompt.show = true;
      } else {
        tmpNegativePrompt.show = false;
      }
      return { ...state, image: { value: action.payload, show: state.image.show } , negative_prompt: tmpNegativePrompt };
    case 'SET_IMAGE_REFERENCE':
      return { ...state, image_reference: { value: action.payload, show: state.image_reference.show } };
    case 'SET_SUBJECT_IMAGE_FIDELITY':
      return { ...state, subject: { ...state.subject, image_fidelity: action.payload } };
    case 'SET_SUBJECT_HUMAN_FIDELITY':
      return { ...state, subject: { ...state.subject, human_fidelity: action.payload } };
    case 'SET_FACE_IMAGE_FIDELITY':
      return { ...state, face: { ...state.face, image_fidelity: action.payload } };
    case 'SET_FACE_IMAGE':
      return {...state, face: {...state.face, faceImg: action.payload } };
    case 'SET_BGREF_IMAGE_FIDELITY':
      return { ...state, bgReference: { ...state.bgReference, image_fidelity: action.payload } };
    case 'SET_N':
      return { ...state, n: { value: action.payload, show: state.n.show } };
    case 'SET_ASPECT_RATIO':
      return { ...state, aspect_ratio: { value: action.payload, show: state.aspect_ratio.show } };
  }
};

export const PictureContext = createContext<{
  state: State;
  dispatch: Dispatch<PictureAction>;
}>({
  state: initialState,
  dispatch: () => null
});

export const PictureProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <PictureContext.Provider value={{ state, dispatch }}>
      {children}
    </PictureContext.Provider>
  );
};