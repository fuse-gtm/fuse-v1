// Fuse sovereignty: this constant no longer points at twenty-icons.com.
// The Fuse-controlled favicon service is self-hosted on the prod EC2 host
// and exposed at https://icons.fusegtm.com (see
// docs/ops-logs/2026-04-23-self-host-favicon.md for the deploy runbook).
//
// Both browser and Node consumers import this value, so the resolution is
// isomorphic-safe: we prefer a runtime override from window._env_ (injected
// by generate-front-config.ts on the frontend), fall back to the Node
// process.env when running on the backend, and otherwise use the Fuse
// default. Never emit any request to twenty-icons.com.

const FUSE_ICONS_DEFAULT_URL = 'https://icons.fusegtm.com';

const resolveIconsBaseUrl = (): string => {
  if (
    typeof globalThis !== 'undefined' &&
    typeof (globalThis as { window?: unknown }).window !== 'undefined'
  ) {
    const runtimeEnv = (
      globalThis as {
        window?: { _env_?: { REACT_APP_ICONS_BASE_URL?: string } };
      }
    ).window?._env_;
    if (
      runtimeEnv?.REACT_APP_ICONS_BASE_URL !== undefined &&
      runtimeEnv.REACT_APP_ICONS_BASE_URL !== ''
    ) {
      return runtimeEnv.REACT_APP_ICONS_BASE_URL;
    }
  }

  if (
    typeof process !== 'undefined' &&
    process.env?.REACT_APP_ICONS_BASE_URL !== undefined &&
    process.env.REACT_APP_ICONS_BASE_URL !== ''
  ) {
    return process.env.REACT_APP_ICONS_BASE_URL;
  }

  return FUSE_ICONS_DEFAULT_URL;
};

export const TWENTY_ICONS_BASE_URL = resolveIconsBaseUrl();
