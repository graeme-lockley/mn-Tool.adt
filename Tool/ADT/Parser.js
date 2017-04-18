/*
 * <start> ::= { <import> } <adt> EOF
 *
 * <import> ::= IMPORT CONSTANT_STRING AS UPPER_ID
 *
 * <adt> ::= TYPE UPPER_ID { LOWER_ID } EQUAL <adt_constructor> { BAR <adt_constructor> }
 *
 * <adt_constructor> ::= UPPER_ID { <type> }
 *
 * <type> ::= UPPER_ID | LOWER_ID | LPAREN UPPER_ID { UPPER_ID | LOWER_ID } RPAREN
 */

const Array = mrequire("core:Data.Array:v1.0.0");
const Tuple = mrequire("core:Data.Tuple:v1.0.0");

const Lexer = require("./Lexer");
const C = mrequire("core:Text.Parsing.Combinators:1.0.0");


// Parser a :: Lexer -> Result String (Tuple a Lexer)


const symbolValue =
    token => C.symbolMap(token)(t => t.value);


const parseType =
    C.or([
        C.symbolMap(Lexer.Tokens.UPPER_ID)(t => Array.singleton(t.value)),
        C.symbolMap(Lexer.Tokens.LOWER_ID)(t => Array.singleton(t.value)),
        C.andMap([
            C.symbol(Lexer.Tokens.LPAREN),
            symbolValue(Lexer.Tokens.UPPER_ID),
            C.many(
                C.or([
                    symbolValue(Lexer.Tokens.UPPER_ID),
                    symbolValue(Lexer.Tokens.LOWER_ID)
                ])),
            C.symbol(Lexer.Tokens.RPAREN)
        ])(t => t.at(2).withDefault(Array.empty).cons(t.at(1).withDefault("")))
    ]);


const parseADTConstructor =
    C.andMap([
        symbolValue(Lexer.Tokens.UPPER_ID),
        C.many(parseType)
    ])(t =>
        Tuple(
            t.at(0).withDefault(""))(
            t.at(1).withDefault(Array.empty)));


const parseADT =
    C.andMap([
        C.symbol(Lexer.Tokens.TYPE),
        symbolValue(Lexer.Tokens.UPPER_ID),
        C.many(symbolValue(Lexer.Tokens.LOWER_ID)),
        C.symbol(Lexer.Tokens.EQUAL),
        parseADTConstructor,
        C.many(
            C.andMap([
                C.symbol(Lexer.Tokens.BAR),
                parseADTConstructor
            ])(t => t.at(1).withDefault(Array.empty))
        )
    ])(t => Tuple(
        t.at(2).withDefault(Array.empty).cons(t.at(1).withDefault("")))(
        t.at(5).withDefault(Array.empty).cons(t.at(4).withDefault(Array.empty))));


const parseImport =
    C.andMap([
        C.symbol(Lexer.Tokens.IMPORT),
        symbolValue(Lexer.Tokens.CONSTANT_STRING),
        C.symbol(Lexer.Tokens.AS),
        symbolValue(Lexer.Tokens.UPPER_ID)
    ])(t => ({name: t.at(3).withDefault(""), reference: t.at(1).withDefault("")}));


const parse =
    C.andMap([
        C.many(parseImport),
        parseADT
    ])(t => Tuple(
        t.at(1).withDefault(Tuple("")("")))(
        t.at(0).withDefault(Array.empty)));


module.exports = {
    parse,
    parseADT,
    parseADTConstructor,
    parseImport,
    parseType
};