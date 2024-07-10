// Agregar eventos a los botones cuando el documento esté listo
document.getElementById('analyze').addEventListener('click', analyzeCode);
document.getElementById('translateToPHP').addEventListener('click', translateToPHP);
document.getElementById('translateToC').addEventListener('click', translateToC);
document.getElementById('open').addEventListener('click', openFile);
document.getElementById('save').addEventListener('click', saveFile);
document.getElementById('saveAs').addEventListener('click', saveAsFile);
document.getElementById('clear').addEventListener('click', clearAll);
document.getElementById('exit').addEventListener('click', exitApp);
document.getElementById('new').addEventListener('click', newFile);

// Función para actualizar la barra de estado
function setStatusBar(message) {
    document.getElementById('statusBar').innerText = message;
}

// Función para registrar mensajes en la consola
function logToConsole(message) {
    const consoleDiv = document.getElementById('console');
    consoleDiv.innerText += message + '\n';
    consoleDiv.scrollTop = consoleDiv.scrollHeight;
}

// Función principal de análisis de código
function analyzeCode() {
    setStatusBar("Analizando código...");
    logToConsole("Inicio del análisis léxico...");
    const sourceCode = document.getElementById('sourceCode').value;
    const tokens = lexicalAnalysis(sourceCode);
    const parseTree = syntacticAnalysis(tokens);
    const semanticAnalysisResult = semanticAnalysis(parseTree);
    displayTokens(tokens);
    displayErrors(semanticAnalysisResult.errors);
    setStatusBar("Análisis completado");
    logToConsole("Análisis léxico completado.");
}

// Función de análisis léxico
function lexicalAnalysis(code) {
    const tokens = [];
    const lines = code.split('\n');
    const tokenRegex = /\w+|[^\s\w]/g; // Expresión regular para identificar tokens
    lines.forEach((line, lineNumber) => {
        let match;
        while ((match = tokenRegex.exec(line)) !== null) {
            tokens.push({
                lexeme: match[0],
                token: identifyToken(match[0]),
                position: `[${lineNumber + 1}, ${match.index + 1}]`
            });
        }
    });
    return tokens;
}

// Función para identificar el tipo de token
function identifyToken(lexeme) {
    if (/^\d+$/.test(lexeme)) return 'NUMBER'; // Si el lexema es un número
    if (/^[a-zA-Z_]\w*$/.test(lexeme)) return 'IDENTIFIER'; // Si el lexema es un identificador
    return 'SYMBOL'; // Si el lexema es un símbolo
}

// Función para mostrar los tokens en la tabla de símbolos
function displayTokens(tokens) {
    const tableBody = document.getElementById('symbolTable');
    tableBody.innerHTML = '';
    tokens.forEach(token => {
        const row = document.createElement('tr');
        row.innerHTML = `<td>${token.lexeme}</td><td>${token.token}</td><td>${token.position}</td>`;
        tableBody.appendChild(row);
    });
}

// Función para mostrar los errores detectados
function displayErrors(errors) {
    const errorsTextArea = document.getElementById('errors');
    errorsTextArea.value = errors.join('\n');
}

// Función de análisis sintáctico (simplificada)
function syntacticAnalysis(tokens) {
    const parseTree = [];
    // Código del análisis sintáctico va aquí
    return parseTree;
}

// Función de análisis semántico (simplificada)
function semanticAnalysis(parseTree) {
    const errors = [];
    // Implementación de verificación de tipos y otros análisis semánticos
    return { errors };
}

// Función para traducir el código JavaScript a PHP
function translateToPHP() {
    setStatusBar("Traduciendo a PHP...");
    const sourceCode = document.getElementById('sourceCode').value;
    const translatedCode = jsToPhp(sourceCode);
    document.getElementById('destinationCode').value = translatedCode;
    setStatusBar("Traducción a PHP completada");
    logToConsole("Traducción a PHP completada.");
}

// Función de conversión de JavaScript a PHP
function jsToPhp(code) {
    let phpCode = `<?php\n\n`;
    phpCode += code
        .replace(/console\.log/g, 'echo')
        .replace(/var /g, '$')
        .replace(/let /g, '$')
        .replace(/const /g, '$')
        .replace(/function /g, 'function ')
        .replace(/;/g, ';')
        .replace(/===/g, '==')
        .replace(/!==/g, '!=');
    phpCode += `\n?>`;
    return phpCode;
}

// Función para traducir el código PHP a C
function translateToC() {
    setStatusBar("Traduciendo a C...");
    const phpCode = document.getElementById('destinationCode').value;
    const translatedCode = phpToC(phpCode);
    document.getElementById('destinationCode').value = translatedCode;
    setStatusBar("Traducción a C completada");
    logToConsole("Traducción a C completada.");
}

// Función de conversión de PHP a C
function phpToC(code) {
    let cCode = `#include <stdio.h>\n\n`;
    cCode += code
        .replace(/<\?php/g, '')
        .replace(/\?>/g, '')
        .replace(/echo/g, 'printf')
        .replace(/\$/g, '')
        .replace(/==/g, '==')
        .replace(/!=/g, '!=')
        .replace(/;/g, ';')
        .replace(/function /g, 'void ')
        .replace(/printf\((.*?)\);/g, 'printf("%s", $1);');
    return cCode;
}

// Función para abrir un archivo
function openFile() {
    const fileInput = document.getElementById('fileInput');
    fileInput.click();
    fileInput.addEventListener('change', function() {
        const file = fileInput.files[0];
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('sourceCode').value = e.target.result;
            setStatusBar("Archivo cargado");
            logToConsole("Archivo cargado correctamente.");
        };
        reader.readAsText(file);
    }, { once: true });
}

// Función para guardar el contenido del área de texto de código fuente
function saveFile() {
    const sourceCode = document.getElementById('sourceCode').value;
    const blob = new Blob([sourceCode], { type: 'text/plain' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'sourceCode.js';
    a.click();
    setStatusBar("Archivo guardado");
    logToConsole("Archivo guardado correctamente.");
}

// Función para guardar el contenido del área de texto de código destino
function saveAsFile() {
    const destinationCode = document.getElementById('destinationCode').value;
    const blob = new Blob([destinationCode], { type: 'text/plain' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'destinationCode.c';
    a.click();
    setStatusBar("Archivo guardado como...");
    logToConsole("Archivo guardado como correctamente.");
}

// Función para limpiar todas las áreas de texto y la consola
function clearAll() {
    document.getElementById('sourceCode').value = '';
    document.getElementById('destinationCode').value = '';
    document.getElementById('errors').value = '';
    document.getElementById('symbolTable').innerHTML = '';
    document.getElementById('console').innerText = '';
    setStatusBar("Todo limpio");
    logToConsole("Todas las áreas de texto y la consola están limpias.");
}

// Función para salir de la aplicación
function exitApp() {
    if (confirm("¿Estás seguro de que deseas salir?")) {
        window.close();
    }
}

// Función para crear un nuevo archivo
function newFile() {
    if (confirm("¿Deseas crear un nuevo archivo? Se perderán los cambios no guardados.")) {
        clearAll();
        setStatusBar("Nuevo archivo creado");
        logToConsole("Nuevo archivo creado.");
    }
}
