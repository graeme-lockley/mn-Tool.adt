const Array = mrequire("core:Data.Array:v1.0.0");
const Result = mrequire("core:Data.Result:1.0.0");
const Tuple = mrequire("core:Data.Tuple:v1.0.0");


function translate(adtAST) {
    const imports = translateImports(adtAST.second);
    const adt = translateADT(adtAST.first);

    return Result.Okay(`${imports}${imports.length === 0 ? "" : "\n\n"}${adt.first}\nmodule.exports = {${adt.second}};\n`);
}


function translateImports(importsAST) {
    const imports = importsAST.toArray();

    let result = "";
    for (let lp = 0; lp < imports.length; lp += 1) {
        if (imports[lp].reference.indexOf(":") > -1) {
            result = result + `const ${imports[lp].name} = mrequire("${imports[lp].reference}");\n`;
        } else {
            result = result + `const ${imports[lp].name} = require("${imports[lp].reference}");\n`;
        }
    }

    return result;
}


function translateADT(adt) {
    function mkState() {
        return `function ${adt.first.at(0).withDefault("")}State(content) {
    this.content = content;
}


`;
    }


    function mkParameterList(n) {
        return Array.range(1)(n + 1).map(n => "p" + n).join(", ");
    }


    function mkConstructors() {
        let result = "";

        const constructorASTs = adt.second.toArray();

        for (let lp = 0; lp < constructorASTs.length; lp += 1) {
            const constructorAST = constructorASTs[lp];

            if (constructorAST.second.length() === 0) {
                result += `const ${constructorAST.first} = new ${adt.first.at(0).withDefault("")}State([${lp}]);\n\n\n`
            } else {
                result += `function ${constructorAST.first}(p1) {
    return ${Array.range(2)(adt.first.length() + 1).map(n => "p" + n).join(" => ")} ${adt.first.length() > 1 ? "=> " : ""}new ${adt.first.at(0).withDefault("")}State([${lp}, ${mkParameterList(adt.first.length())}]);
}


`;
            }
        }

        return result;
    }


    function mkReduce() {
        return `${adt.first.at(0).withDefault("")}State.prototype.reduce = function (f${adt.second.head().withDefault(Tuple("")("")).first}) {
    return ${adt.second.tail().withDefault(Array.empty).map(a => "f" + a.first).join(" => ")} => {
        switch (this.content[0]) {
${Array.range(0)(adt.second.length()).zip(adt.second).map(c => `            case ${c.first}: return f${c.second.first}(${Array.range(0)(c.second.second.length()).map(p => `this.content[${p + 1}]`).join(")(")});`).join("\n")}
        }
    };
};


`
    }


    function mkToString() {
        return `${adt.first.at(0).withDefault("")}State.prototype.toString = function () {
    return this.reduce${adt.second.map(c => c.second.length() === 0 ? `(() => "${c.first}")` : `(${Array.range(1)(c.second.length() + 1).map(i => "p" + i).join(" => ")} => \`(${c.first} ${Array.range(1)(c.second.length() + 1).map(i => `\${p${i}.toString()}`).join(" ")})\``).join("")});
};

`
    }


    return Tuple(mkState() + mkConstructors() + mkReduce() + mkToString())(`${adt.first.at(0).withDefault("")}State, ${adt.second.map(c => c.first).join(", ")}`);
}


module.exports = translate;

