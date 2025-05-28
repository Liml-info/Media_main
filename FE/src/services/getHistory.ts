
import { fetchImageGenerationTaskList } from "./imageGeneration";
import { fetchImageToVideoTaskList } from "./imageToVideo";
import { fetchMultiImageToVideoTaskList } from "./MultiImageToVideo";
import { fetchTextToVideoTaskList } from "./TextToVideo";
import { fetchTryOnTaskList } from "./virtualTryOn";

export const fetchHistory = async () => {
  fetchImageGenerationTaskList();
  fetchImageToVideoTaskList();
  fetchTextToVideoTaskList();
  fetchMultiImageToVideoTaskList();
  fetchTryOnTaskList();
};