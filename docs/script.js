/** @returns {void} */
function fixAllPreIndentation() {
	[].forEach.call(document.querySelectorAll('pre'), function ($pre) {
		let lines = $pre.textContent.split('\n');
		let matches;
		const indentation = (matches = /^\s+/.exec(lines[0])) != null ? matches[0] : null;
		if (indentation !== null) {
			lines = lines.map(function (line) {
				return line.replace(indentation, '');
			});
			return $pre.textContent = lines.join('\n').trim();
		}
	});
}

window.addEventListener('load', () => {
	fixAllPreIndentation();
});