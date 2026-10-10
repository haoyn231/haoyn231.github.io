/**
 * Shiki/TextMate grammar for Device Tree Source files.
 *
 * References:
 * - Shiki custom language guide: https://shiki.style/guide/load-lang
 * - DTS grammar from vscode-devicetree (MIT):
 *   https://github.com/trond-snekvik/vscode-devicetree/blob/master/syntax/dts.tmLanguage.json
 * - Devicetree specification: https://devicetree-specification.readthedocs.io/
 */
const dtsGrammar = {
	name: "dts",
	scopeName: "source.dts",
	aliases: ["devicetree", "device-tree", "dtsi"],
	fileTypes: ["dts", "dtsi", "overlay"],
	patterns: [
		{ include: "#comments" },
		{ include: "#preprocessor" },
		{ include: "#directives" },
		{ include: "#strings" },
		{ include: "#labels" },
		{ include: "#references" },
		{ include: "#node-names" },
		{ include: "#properties" },
		{ include: "#byte-arrays" },
		{ include: "#numbers" },
		{ include: "#operators" },
	],
	repository: {
		comments: {
			patterns: [
				{
					name: "comment.line.double-slash.dts",
					match: "//.*$",
				},
				{
					name: "comment.block.dts",
					begin: "/\\*",
					end: "\\*/",
				},
			],
		},
		preprocessor: {
			patterns: [
				{
					name: "meta.preprocessor.include.dts",
					match: '^\\s*(#\\s*include)\\s+(<[^>]+>|"[^"]+")',
					captures: {
						1: { name: "keyword.control.directive.include.dts" },
						2: { name: "string.quoted.other.lt-gt.include.dts" },
					},
				},
				{
					name: "meta.preprocessor.dts",
					begin:
						"^\\s*(#\\s*(?:define|if|ifdef|ifndef|elif|else|endif|undef|pragma|error))\\b",
					beginCaptures: {
						1: { name: "keyword.control.directive.dts" },
					},
					end: "(?<!\\\\)$",
					patterns: [
						{ include: "#comments" },
						{ include: "#strings" },
						{ include: "#numbers" },
						{ include: "#operators" },
					],
				},
			],
		},
		directives: {
			name: "keyword.control.directive.dts",
			match:
				"/(?:dts-v1|plugin|memreserve|delete-node|delete-property|omit-if-no-ref|bits)/",
		},
		strings: {
			name: "string.quoted.double.dts",
			begin: '"',
			end: '"',
			patterns: [
				{
					name: "constant.character.escape.dts",
					match: "\\\\(?:[\\\\\"'abfnrtv]|[0-7]{1,3}|x[0-9a-fA-F]{2})",
				},
			],
		},
		labels: {
			name: "entity.name.type.label.dts",
			match: "\\b[A-Za-z_][\\w-]*(?=\\s*:)",
		},
		references: {
			patterns: [
				{
					name: "variable.other.reference.dts",
					match: "&(?:[A-Za-z_][\\w-]*|\\{[/A-Za-z0-9_@.,+\\-]+\\})",
				},
			],
		},
		"node-names": {
			name: "entity.name.type.node.dts",
			match: "(?:/|[A-Za-z_][\\w,.+\\-]*)(?:@[0-9a-fA-F,]+)?(?=\\s*\\{)",
		},
		properties: {
			name: "variable.other.property.dts",
			match: "[A-Za-z_#][\\w,.+?#\\-]*(?=\\s*(?:=|;))",
		},
		"byte-arrays": {
			name: "meta.byte-array.dts",
			begin: "\\[",
			end: "\\]",
			patterns: [
				{
					name: "constant.numeric.hex.dts",
					match: "(?<![0-9a-fA-F])[0-9a-fA-F]{2}(?![0-9a-fA-F])",
				},
				{ include: "#comments" },
			],
		},
		numbers: {
			patterns: [
				{
					name: "constant.numeric.hex.dts",
					match: "\\b0[xX][0-9a-fA-F]+\\b",
				},
				{
					name: "constant.numeric.decimal.dts",
					match: "\\b[0-9]+\\b",
				},
			],
		},
		operators: {
			patterns: [
				{
					name: "keyword.operator.dts",
					match: "<<|>>|&&|\\|\\||==|!=|<=|>=|[=&|!<>+*/%~^-]",
				},
				{
					name: "punctuation.separator.dts",
					match: "[{}<>;,()]",
				},
			],
		},
	},
};

export default dtsGrammar;
