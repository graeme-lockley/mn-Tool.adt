const Runner = mrequire("core:Test.Unit.Runner:v1.0.0");


Runner(__dirname)({filter: filename => filename.endsWith("Test.js")});
