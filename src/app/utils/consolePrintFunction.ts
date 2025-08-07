/* eslint-disable no-console */
import envConfig from "../config/envConfig";





/* eslint-disable @typescript-eslint/no-explicit-any*/
export const consolePrint = (...args: any[]) => {
    if (envConfig.node_environment === 'development') {
        const stack = new Error().stack;
        const callerLine = stack?.split('\n')[2]; // Get the caller's line (index 2 has the caller's info)
        const match = callerLine?.match(/\((.+):(\d+):(\d+)\)/) || callerLine?.match(/at (.+):(\d+):(\d+)/);

        if (match) {
            const [, filePath, lineNumber] = match;
            const fileName = filePath.split(/[/\\]/).pop(); // Works for both Windows and Unix paths
            console.log(`[${fileName}:${lineNumber}]`, ...args);
        } else {
            console.log(...args);
        }
    } else console.log('🔒 Only disclosed in development mode');
};
