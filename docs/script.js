/**
 * Fixes a indentation and escapes of pre tags.
 * @returns {void}
 */
function fixAllPreTags() {
	[].forEach.call(document.querySelectorAll('pre'), function (/** @type {HTMLPreElement} */ pre) {
		// Make the indentation of the first line the first indentation.
		let lines = pre.textContent.split('\n');
		let matches;
		const indentation = (matches = /^\s+/.exec(lines[0])) != null ? matches[0] : null;
		if (indentation !== null) {
			lines = lines.map(function (line) {
				return line.replace(indentation, '');
			});
			pre.textContent = lines.join('\n').trim();
		}
	});

	[].forEach.call(document.querySelectorAll('.code'), function (/** @type {HTMLElement} */ elem) {
		// Combine all child nodes, since they really were just <tag> things.
		flattenNode(elem);
		// Transform any &, <, and > characters into their respective escapes.
		elem.textContent.replace('<', '&lt;');
		elem.textContent.replace('>', '&gt;');
		elem.textContent.replace('&', '&nbsp;');

		// Make the indentation of the first line the first indentation.
		let lines = elem.textContent.split('\n');
		let matches;
		if (lines.length > 1) {
			if (lines[0] === '') {
				lines.shift();
			}
			const indentation = (matches = /^\s+/.exec(lines[0])) != null ? matches[0] : null;
			if (indentation !== null) {
				lines = lines.map(function (line) {
					return line.replace(indentation, '');
				});
				elem.textContent = lines.join('\n').trim();
			}
		}
	});
}

/** This flattens a node, escaping the < and > characters.
 *  It doesn't fix every scenarios (ending tags without starting tags), but mostly works.
 * @param {Element} elem
*/
function flattenNode(elem) {
	let text = '';
	for (let i = 0; i < elem.childNodes.length; i++) {
		const node = elem.childNodes[i];
		if (node instanceof Text) {
			text += node.textContent;
		}
		else if (node instanceof Element) {
			flattenNode(node);
			text += '<' + node.tagName;
			for (let j = 0; j < node.attributes.length; j++) {
				const attribute = node.attributes[j];
				if (j > 0) {
					text += ' ';
				}
				text += attribute.name + '=' + attribute.value;
			}
			text += '>';
			text += node.innerHTML;
			text += '</' + node.tagName + '>';
		}
	}
	text = text.replace('&amp;', '&');
	elem.textContent = text;
}

window.addEventListener('load', () => {
	fixAllPreTags();
});