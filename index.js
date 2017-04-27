const Lexer = require("./Tool/ADT/Lexer");
const Parser = require("./Tool/ADT/Parser");
const Result = mrequire("core:Data.Result:1.0.0");
const SyncFileSystem = mrequire("core:System.IO.Native.SyncFileSystem:1.0.0");
const Translate = require("./Tool/ADT/Translate");


const compile = sourceName => targetName =>
    SyncFileSystem.readFile(sourceName)
        .andThen(content => Parser.parse(Lexer.fromString(content)))
        .andThen(ast => Translate(ast.first))
        .andThen(SyncFileSystem.writeFile(targetName));


module.exports = compile;