import child_process from "child_process";
import process from "process";

// Given a shell command as a string, execute it with Bash. Options:
//
// getStdout: if given and truthy, return stdout as a string instead
//   of streaming it to the standard location
// getStderr: same but for stderr
//
// Return value is an object with required property code and, optional
// properties stdout, stderr.
export async function runCommand(cmd, options) {
  const { getStdout, getStderr } = options || {};
  console.error(`$ ${cmd}`);
  const rv = await new Promise((resolve, reject) => {
    const rv = { stdout: "", stderr: "" };
    const proc = child_process.spawn(
      "bash",
      ["-c", `set -euo pipefail; ${cmd}`],
      {
        stdio: [
          process.stdin,
          getStdout ? "pipe" : process.stdout,
          getStderr ? "pipe" : process.stderr,
        ],
      }
    );
    if (getStdout) {
      proc.stdout.on("data", (data) => {
        rv.stdout += data.toString();
      });
    }
    if (getStderr) {
      proc.stderr.on("data", (data) => {
        rv.stderr += data.toString();
      });
    }
    proc.on("error", reject);
    proc.on("close", (code) => resolve({ code, ...rv }));
  });
  if (rv.code !== 0) {
    throw new Error(`command exited with code ${rv.code}`);
  }
  return rv;
}

// Return the Riju-Script-Hash field in a .deb file generated by Riju.
export async function getDebHash(debPath) {
  return (
    await runCommand(`dpkg-deb -f ${debPath} Riju-Script-Hash`, {
      getStdout: true,
    })
  ).stdout.trim();
}
