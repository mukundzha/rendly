import { parseDemo } from './src/lib/parser';

const code = `SET WIDTH 1920
SET HEIGHT 1080
SET BACKGROUND #FFFFFF
SET COLOR #111111

SHOW "Test" FADE IN FOR 1 SECOND
END`;

const result = parseDemo(code);
console.log(JSON.stringify(result, null, 2));