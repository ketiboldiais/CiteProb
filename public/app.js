const inputFile = document.getElementById("inputFile");
const btnUpload = document.getElementById("uploadButton");
const resultText = document.getElementById("resultText");
const caseList = document.getElementById("caseList");
const data = {
	extractedText: "",
	caseNames: [],
	fedReporter1D: [],
	fedReporter2D: [],
	fedReporter3D: [],
	scotusCases: [],
	usConst: [],
	stateCases: [],
	IRC: [],
	USC: [],
	fedCrimPro: [],
	fedCivPro: [],
	fedReg: [],
};

const citePatterns = {
	caseHeader1_v_1: /([\w]+ v\. [\w^ ]+(?=,))/gim,
	// /([\w]+ v\. [\w^ ]+)|(United States v. [\w\D]+(?=\.,))|(\bIn re\b [\w]+(?=,))|([\w]+ [\w]+ v\. [\w]+)/gim,
	fedReporter1D:
		/([1-9]|[1-9][0-9]|1[0-9][0-9]|2[0-7][0-9]|28[0-1]) F\.? ([0-9]+)(\.|;|,|-|\s)/gim,
	fedSupp: /([0-9]+ (F\.? ?Supp\.? ?2d\.?|F\.? ?Supp\.?) [0-9]+)/gim,
	uniformCommercialCode:
		/(UCC|U\.C\.C\.|Uniform Commercial Code) ?(ȼs|&sect;|&#167;|section|sect?\.?)* ?(([1-9A]+)-([0-9]+))/gim,
	scotusCases:
		/([0-9]|[1-9][0-9]|[1-5][0-9][0-9]) (u\.? ?s\.?) ([0-9]+)(, ([0-9]+))?( \(([0-9]+)\))?/gim,
	usConst:
		/(U\.? ?S\.?) Const\.?,? ?(((a|A)rt\.?|(a|A)mend\.?|(p|P)mbl\.?|(p|P)reamble)( ?[XVI]+))?((, (ȼs|S|&sect;|&#167) ([0-9]+)) ?(, cl\. ([0-9]+)\.?)?)?/gim,
	fedReporter2D:
		/(17[8-9]|1[8-9][0-9]|[2-9][0-9][0-9]) ?F\.? ?2d\.? ?([0-9]+)/gim,
	fedReporter3D:
		/([1-9]|[1-9][0-9]|[1-9][0-9][0-9]) F\.? ?3d\.? ([0-9]+)/gim,
	regionalStateCases:
		/([1-9]|[1-9][0-9]|[1-9][0-9][0-9]) ((So\.?|P\.?|S\.? ?W\.?|S\.? ?E\.?|N\.? ?W\.?|N\.? ?E\.?|A\.?)( ?(2|3)d\.?)?) ([0-9]+)(,|\.|;| )/gi,
	usc: /\d+\sU\.(\s)?S\.(\s)?C(ode)?(\.)?\s(§+|Sec\.)?(\s)?(\d)+(\-\d+)?(\([\w\d]+\))*/g,
	irc: /I\.? ?R\.? ?C\.? (?:ȼs|&sect;|&#167|section|sect?\.?)? ?(\d{1,6}(?:[a-zA-Z]{0,4}(?:\-\d{0,3}[a-zA-Z]?)?)?) ?((?:\([0-9a-zA-Z]\))+)? ?(?:\((\d{4})\))?/g,
	fre: /(FRE | fre |Fed\.? ?R(\.?|ule) ?Evid\.?|Federal Rules? of Evidence)( ?[0-9]+)?/g,
	frCrimPro:
		/(FRCrP|Fed\.? ?R(\.?|ule) ?Crim\.? ?Pr?o?c?\.?|Federal Rules? of Criminal Procedure) (([0-9]+)\.?([0-9])?)?/g,
	fedReg:
		/\d+\s[Ff](ed)?\.?\s?[Rr](eg)?\.?(\sat)?\s\d+(\,\s\d+)?\-?\d*(\s\(\d+\))?/g,
};

const characters = {
	newLine: /\n/gim,
	doubleSpace: /\s\s/gim,
	space: " ",
	emptyString: "",
	hyphenatedLines: /- /gim,
};

btnUpload.addEventListener("click", () => {
	const formData = new FormData();
	formData.append("pdfFile", inputFile.files[0]);
	fetch("/extract-text", {
		method: "post",
		body: formData,
	})
		.then((response) => {
			return response.text();
		})
		.then((extractedText) => {
			let result = extractedText
				.trim()
				.replace(characters.newLine, characters.space)
				.replace(characters.doubleSpace, characters.space)
				.replace(characters.hyphenatedLines, characters.emptyString);
			data.caseNames = result.match(citePatterns.caseHeader1_v_1);
			data.scotusCases = result.match(citePatterns.scotusCases);
			data.fedReporter1D = result.match(citePatterns.fedReporter1D);
			data.fedReporter2D = result.match(citePatterns.fedReporter2D);
			data.fedReporter3D = result.match(citePatterns.fedReporter3D);
			data.USC = result.match(citePatterns.usc);
			data.usConst = result.match(citePatterns.usConst);
			resultText.value = result;

			for (let i = 0; i < data.scotusCases.length; i++) {
				let li = document.createElement("li");
				li.innerText = data.scotusCases[i];
				caseList.append(li);
			}
			for (let i = 0; i < data.caseNames.length; i++) {
				let caseNameLI = document.createElement('li')
				caseNameLI.innerText = data.caseNames[i];
				caseList.append(caseNameLI);
			}
		});
});


