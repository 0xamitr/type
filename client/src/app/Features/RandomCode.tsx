function generateFunction() {
    const functionName = `function${Math.floor(Math.random() * 10) + 1}`;
    const numParams = Math.floor(Math.random() * 3) + 1;
    let params = '';
    for (let i = 0; i < numParams; i++) {
        params += `param${i + 1}`;
        if (i !== numParams - 1) {
            params += ', ';
        }
    }
    const functionCode = generateCodeSnippet();
    return `function ${functionName}(${params}) {↵${functionCode}}↵↵`;
}

function generateCodeSnippet() {
    const keywords = ['let', 'const', 'var', 'function', 'if', 'else', 'for', 'while', 'return'];
    const dataTypes = ['number', 'string', 'boolean', 'object', 'array'];
    const operators = ['+', '-', '*', '/', '%', '==', '!=', '===', '!==', '<', '>', '<=', '>=', '&&', '||'];
    const symbols = [';', ',', '(', ')', '{', '}'];

    let code = '';

    const numVariables = Math.floor(Math.random() * 5) + 1;
    for (let i = 0; i < numVariables; i++) {
        const dataType = dataTypes[Math.floor(Math.random() * dataTypes.length)];
        const identifier = `var${i + 1}`;
        code += `^${dataType} ${identifier};↵`;
    }
    const numOperations = Math.floor(Math.random() * 5) + 1;
    for (let i = 0; i < numOperations; i++) {
        const identifier = `var${Math.floor(Math.random() * numVariables) + 1}`;
        const operator = operators[Math.floor(Math.random() * operators.length)];
        let operand;
        if (operator === '||' || operator === '&&') {
            operand = (Math.random() > 0.5) ? 'true' : 'false';
        } else {
            operand = Math.floor(Math.random() * 100);
        }
        code += `^${identifier} = ${identifier} ${operator} ${operand};↵`;
    }

    return code;
}

function generateMainFunction() {
    const mainCode = generateCodeSnippet();
    return `int main() {↵${mainCode}^return 0;↵}↵`;
}

export default function randomCode() {
    let code = '';
    code += generateMainFunction();
    const numFunctions = Math.floor(Math.random() * 1) + 1;
    for (let i = 0; i < numFunctions; i++)
        code += generateFunction()
    console.log(code)
    return code;
}