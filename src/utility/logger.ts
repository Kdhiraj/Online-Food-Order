import pino from "pino";

const logger = pino({
  transport: {
    target: "pino-pretty",
    options: {
      colorize: true,
      translateTime: "mm-dd-yyyy, h:MM:ss TT",
    },
  },
  base: {
    pid: false,
  },
});

export { logger };
