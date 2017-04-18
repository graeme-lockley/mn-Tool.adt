const Array = mrequire("core:Data.Array:v1.0.0");
const Lexer = mrequire("core:Text.Parsing.Lexer:v1.0.0");
const Maybe = mrequire("core:Data.Maybe:v1.0.0");
const Regex = mrequire("core:Data.String.Regex:v1.0.0");
const Tuple = mrequire("core:Data.Tuple:v1.0.0");


const Tokens = {
    EOF: 0,
    ERR: -1,

    CONSTANT_STRING: 1,
    LOWER_ID: 2,
    UPPER_ID: 3,

    BAR: 4,
    EQUAL: 5,
    LPAREN: 6,
    RPAREN: 7,

    AS: 8,
    IMPORT: 9,
    TYPE: 10
};


const keywords = {
    "as": Tokens.AS,
    "import": Tokens.IMPORT,
    "type": Tokens.TYPE
};


const lexerDefinition = Lexer.setup({
    eof: {id: Tokens.EOF},
    err: text => ({id: Tokens.ERR, value: text}),
    whitespacePattern: Maybe.Just(Regex.from(/\s+/iy)),
    tokenPatterns: Array.from([
        Tuple(Regex.from(/"(\\.|[^"\\])*"/y))(text => ({ id: Tokens.CONSTANT_STRING, value: text.substring(1, text.length - 1  )})),
        Tuple(Regex.from(/[a-z_][A-Za-z0-9_]*/y))(text => keywords[text] ? ({id: keywords[text]}) : ({ id: Tokens.LOWER_ID, value: text})),
        Tuple(Regex.from(/[A-Z][A-Za-z0-9_]*/y))(text => ({id: Tokens.UPPER_ID, value: text})),
        Tuple(Regex.from(/\|/y))(text => ({id: Tokens.BAR})),
        Tuple(Regex.from(/=/y))(text => ({id: Tokens.EQUAL})),
        Tuple(Regex.from(/\(/y))(text => ({id: Tokens.LPAREN})),
        Tuple(Regex.from(/\)/y))(text => ({id: Tokens.RPAREN}))
    ]),
    comments: Array.from([
        {open: Regex.from(/\/\//my), close: Regex.from(/\n/my), nested: false}
    ])
});


const fromString = lexerDefinition.fromString;


module.exports = {
    Tokens, fromString
};