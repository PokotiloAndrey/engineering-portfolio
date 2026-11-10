// Validate an isolated preview configuration before invoking a deployment tool.
export function previewConfig({workerName, image, liveEnabled, routes = []}) {
  if (typeof workerName !== "string" || !/^preview-[a-z0-9-]+$/.test(workerName)) {
    throw new Error("an isolated preview worker name is required");
  }
  if (typeof image !== "string" || !/^[a-z0-9./:_-]+@sha256:[a-f0-9]{64}$/.test(image)) {
    throw new Error("use an immutable image digest");
  }
  if (liveEnabled !== false || !Array.isArray(routes) || routes.length !== 0) {
    throw new Error("the preview must have live writes and public routes disabled");
  }
  return {
    name: workerName,
    workers_dev: false,
    preview_urls: false,
    routes: [],
    vars: {LIVE_ENABLED: "false"},
    containerImage: image,
  };
}
