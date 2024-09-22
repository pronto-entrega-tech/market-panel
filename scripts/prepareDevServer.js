const fs = require("fs");
const { exec } = require("child_process");
const logFilePath = "./scripts/webpack-dev-server.log";
const errorLogFilePath = "./scripts/webpack-dev-server-error.log";

console.log(
  `Preparing webpack development server. (Logging webpack output to '${logFilePath}')`,
);

// Delete the old webpack-dev-server.log if it is present
try {
  fs.unlinkSync(logFilePath);
} catch {
  // Existing webpack-dev-server log file may not exist
}

// Delete the old webpack-dev-server-error.log if it is present
try {
  fs.unlinkSync(errorLogFilePath);
} catch {
  // Existing webpack-dev-server-error log file may not exist
}

// Start the webpack development server
exec("npm run dev");
