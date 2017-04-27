const FS = require("fs");
const Lexer = require("./Tool/ADT/Lexer");
const Parser = require("./Tool/ADT/Parser");
const Result = mrequire("core:Data.Result:1.0.0");
const Translate = require("./Tool/ADT/Translate");


function compile(sourceName, targetName) {
    return loadFile(sourceName)
        .andThen(content => Parser.parse(Lexer.fromString(content)))
        .andThen(ast => Translate(ast.first))
        .andThen(content => writeFile(targetName, content));
}


function loadFile(fileName) {
    try {
        return Result.Okay(FS.readFileSync(fileName));
    } catch (e) {
        return Result.Error(e.toString());
    }
}


function writeFile(fileName, content) {
    try {
        return Result.Okay(FS.writeFileSync(fileName, content));
    } catch (e) {
        return Result.Error(e.toString());
    }
}


module.exports = compile;