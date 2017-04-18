const Assert = require("assert");
const Unit = mrequire("core:Test.Unit:v1.0.0");

const Lexer = require("../Tool/ADT/Lexer");


Unit.newSuite("Lexer Suite")
    .case("given 'import as type' should return the corresponding tokens", () => {
        const lexer = next(Lexer.fromString("import as type"));

        Assert.equal(lexer(0).token().id, Lexer.Tokens.IMPORT);
        Assert.equal(lexer(1).token().id, Lexer.Tokens.AS);
        Assert.equal(lexer(2).token().id, Lexer.Tokens.TYPE);
        Assert.equal(lexer(3).token().id, Lexer.Tokens.EOF);
    })

    .case("given 'abc Abc \"hello\"' should return the corresponding tokens", () => {
        const lexer = next(Lexer.fromString('abc Abc "hello"'));

        Assert.equal(lexer(0).token().id, Lexer.Tokens.LOWER_ID);
        Assert.equal(lexer(0).token().value, "abc");
        Assert.equal(lexer(1).token().id, Lexer.Tokens.UPPER_ID);
        Assert.equal(lexer(1).token().value, "Abc");
        Assert.equal(lexer(2).token().id, Lexer.Tokens.CONSTANT_STRING);
        Assert.equal(lexer(2).token().value, "hello");
        Assert.equal(lexer(3).token().id, Lexer.Tokens.EOF);
    })

    .case("given '| = ( )' should return the corresponding tokens", () => {
        const lexer = next(Lexer.fromString("| = ( )"));

        Assert.equal(lexer(0).token().id, Lexer.Tokens.BAR);
        Assert.equal(lexer(1).token().id, Lexer.Tokens.EQUAL);
        Assert.equal(lexer(2).token().id, Lexer.Tokens.LPAREN);
        Assert.equal(lexer(3).token().id, Lexer.Tokens.RPAREN);
        Assert.equal(lexer(4).token().id, Lexer.Tokens.EOF);
    });


function next(lexer) {
    return n => {
        let loop = 0;
        let current = lexer;
        while (loop < n) {
            current = current.next();
            loop += 1;
        }

        return current;
    }
}
