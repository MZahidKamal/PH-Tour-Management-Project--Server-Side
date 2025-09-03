/* eslint-disable no-console */
import envConfig from "../config/envConfig";





/* eslint-disable @typescript-eslint/no-explicit-any*/
export const consolePrint = (...args: any[]) => {

    const stack = new Error().stack;
    const callerLine = stack?.split('\n')[2];                                                   // Get the caller's line (index 2 has the caller's info)
    const match = callerLine?.match(/\((.+):(\d+):(\d+)\)/) || callerLine?.match(/at (.+):(\d+):(\d+)/);

    if (envConfig.node_environment === 'development') {
        if (match) {
            const [, filePath, lineNumber] = match;
            const fileName = filePath.split(/[/\\]/).pop() as string; // Works for both Windows and Unix paths
            console.log(`[${fileName}:${lineNumber}]`, ...args);
        } else {
            console.log(...args);
        }
    }
    else if (envConfig.node_environment === 'production') {
        if (match) {
            const [, filePath, _lineNumber] = match;
            const fileName = filePath.split(/[/\\]/).pop() as string; // Works for both Windows and Unix paths

            if (fileName.includes('server.ts')){
                console.log(`[${fileName}]`, ...args);
            }
        }
    }
    else {
        console.log('🔒 Only disclosed in development mode');
    }
};
