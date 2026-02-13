const LEVELS = ["none", "error", "warn", "info", "debug"];

export function createLogger(level = "info") {
  const normalized = LEVELS.includes(level) ? level : "info";
  const currentIndex = LEVELS.indexOf(normalized);

  const canLog = (name) => LEVELS.indexOf(name) <= currentIndex;

  return {
    debug: (...args) => {
      if (canLog("debug")) console.debug(...args);
    },
    info: (...args) => {
      if (canLog("info")) console.info(...args);
    },
    warn: (...args) => {
      if (canLog("warn")) console.warn(...args);
    },
    error: (...args) => {
      if (canLog("error")) console.error(...args);
    },
  };
}
