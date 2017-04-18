const Assert = require("assert");
const Unit = mrequire("core:Test.Unit:v1.0.0");

const Array = mrequire("core:Data.Array:v1.0.0");
const Tuple = mrequire("core:Data.Tuple:v1.0.0");
const Result = mrequire("core:Data.Result:1.0.0");

const Lexer = require("../Tool/ADT/Lexer");
const Parser = require("../Tool/ADT/Parser");


Unit.newSuite("Parser Suite - parse")
    .case("given 'type List a = Nil | Cons a (List a)' should return corresponding AST", () => {
        Assert.deepEqual(
            astResult(Parser.parse(Lexer.fromString("type List a = Nil | Cons a (List a)"))),
            Tuple(
                Tuple(Array.from(["List", "a"]))(Array.from([
                    Tuple("Nil")(Array.empty),
                    Tuple("Cons")(Array.from([Array.singleton("a"), Array.from(["List", "a"])]))
                ])))(
                Array.empty
            ));
    });

Unit.newSuite("Parser Suite - parseImport")
    .case("given 'import \"core:Data.String:1.0.0\" as String' should return Tuple(\"core:Data.String:1.0.0\", \"String\")", () => {
        Assert.deepEqual(
            astResult(Parser.parseImport(Lexer.fromString('import "core:Data.String:1.0.0" as String'))),
            {reference: "core:Data.String:1.0.0", name: "String"});
    });


Unit.newSuite("Parser Suite - parseADT")
    .case("given 'type Maybe a = Just a | Nothing' should return corresponding AST", () => {
        Assert.deepEqual(
            astResult(Parser.parseADT(Lexer.fromString("type Maybe a = Just a | Nothing"))),
            Tuple(Array.from(["Maybe", "a"]))(Array.from([
                Tuple("Just")(Array.singleton(Array.singleton("a"))),
                Tuple("Nothing")(Array.empty)
            ])));
    });


Unit.newSuite("Parser Suite - parseADTConstructor")
    .case("given 'Nothing' should return Tuple('Nothing', []", () => {
        Assert.deepEqual(
            astResult(Parser.parseADTConstructor(Lexer.fromString("Nothing"))),
            Tuple("Nothing")(Array.empty));
    })
    .case("given 'Just Int' should return Tuple('Just', [['Int']]", () => {
        Assert.deepEqual(
            astResult(Parser.parseADTConstructor(Lexer.fromString("Just Int"))),
            Tuple("Just")(Array.singleton(Array.singleton("Int"))));
    })
    .case("given 'Node a a' should return Tuple('Node', [['a'], ['a']]", () => {
        Assert.deepEqual(
            astResult(Parser.parseADTConstructor(Lexer.fromString("Node a a"))),
            Tuple("Node")(Array.from([Array.singleton("a"), Array.singleton("a")])));
    })
    .case("given 'Result String (Tuple a Lexer)' should return Tuple('Result', [['String'], ['Tuple', 'a', 'Lexer']]", () => {
        Assert.deepEqual(
            astResult(Parser.parseADTConstructor(Lexer.fromString("Result String (Tuple a Lexer)"))),
            Tuple("Result")(Array.from([Array.singleton("String"), Array.from(["Tuple", "a", "Lexer"])])));
    });


Unit.newSuite("Parser Suite - parseType")
    .case("given 'a' should return ['a']", () => {
        Assert.deepEqual(astResult(Parser.parseType(Lexer.fromString("a"))), Array.from(["a"]));
    })
    .case("given 'Integer' should return ['Integer']", () => {
        Assert.deepEqual(astResult(Parser.parseType(Lexer.fromString("Integer"))), Array.from(["Integer"]));
    })
    .case("given '(Maybe String)' should return ['Maybe', 'String']", () => {
        Assert.deepEqual(astResult(Parser.parseType(Lexer.fromString("(Maybe String)"))), Array.from(["Maybe", "String"]));
    })
    .case("given '(Maybe String a b)' should return ['Maybe', 'String', 'a', 'b']", () => {
        Assert.deepEqual(astResult(Parser.parseType(Lexer.fromString("(Maybe String a b)"))), Array.from(["Maybe", "String", "a", "b"]));
    });


function astResult(value) {
    return value.reduce(okay => okay.first)(error => Assert.fail(`${error.first.position()}: ${error.second}`));
}