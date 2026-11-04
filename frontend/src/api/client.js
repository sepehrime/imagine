import axios from "axios";

/**
 * API client
 *
 * SWE Design Patterns applied:
 * 1. Single HTTP Gateway: one configured axios instance for the whole app.
 *    Relative URLs go through Vite's `/api` proxy in development.
 * 2. Error Normalisation: `toApiError` turns axios' many failure shapes
 *    (server offline, timeout, FastAPI 422 validation list, 500) into one
 *    `{ title, message, details }` object that <ErrorMessage> can render.
 * 3. Cancellation: every call accepts an AbortSignal, so a component can
 *    cancel a request it no longer needs (newer click, page unmount).
 */
export const api = axios.create({
  baseURL: "/",
  timeout: 15000,
  headers: { "Content-Type": "application/json" },
});

export function isCancel(err) {
  return axios.isCancel(err) || err?.name === "CanceledError";
}

export function toApiError(err) {
  if (!err.response) {
    return {
      title: "Can't reach the backend",
      message:
        "The Python server doesn't seem to be running. Start it from the backend folder with: uvicorn main:app --reload --port 8000",
      details: err.message,
    };
  }

  const { status, data } = err.response;
  if (status === 422 && Array.isArray(data?.detail)) {
    return {
      title: "Invalid request",
      message: data.detail.map((d) => d.msg).join(" "),
      details: data.detail,
    };
  }
  return {
    title: `Server error (${status})`,
    message: typeof data?.detail === "string" ? data.detail : "The backend returned an unexpected error.",
    details: data,
  };
}

/** POST /api/forward-pass/run */
export async function runForwardPass({ architecture, inputs, activation, seed }, { signal } = {}) {
  const { data } = await api.post(
    "/api/forward-pass/run",
    { architecture, inputs, activation, seed },
    { signal }
  );
  return data;
}

/** GET /api/train/datasets/{name} */
export async function getDataset(name, { signal } = {}) {
  const { data } = await api.get(`/api/train/datasets/${name}`, { signal });
  return data;
}

/** POST /api/train/start → first status snapshot (includes training_id) */
export async function startTraining({ dataset, learningRate, epochs, hiddenSize }) {
  const { data } = await api.post("/api/train/start", {
    dataset,
    learning_rate: learningRate,
    epochs,
    hidden_size: hiddenSize,
  });
  return data;
}

/** GET /api/train/status/{id}?since=N → only the epochs after index N */
export async function getTrainingStatus(trainingId, since, { signal } = {}) {
  const { data } = await api.get(`/api/train/status/${trainingId}`, { params: { since }, signal });
  return data;
}

export async function pauseTraining() {
  const { data } = await api.post("/api/train/pause");
  return data;
}

export async function resumeTraining() {
  const { data } = await api.post("/api/train/resume");
  return data;
}

export async function resetTraining() {
  await api.post("/api/train/reset");
}
