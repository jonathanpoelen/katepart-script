/* kate-script
 * author: Jonathan Poelen <jonathan.poelen@gmail.com>
 * license: LGPL
 * revision: 1
 * kate-version: 4
 * type: commands
 * functions: romanNumeral
 */

require("cursor.js")

function romanNumeral(n)
{
	var numeralLetters = "IVXLCDM", number;
	if (!isNaN(number = +n) && 0 <= number && number <= 4999)
	{
		var roman = "", i = 0, len = n.length, k = len * 2;
		if (n >= 4000)
		{
			k -= 2;
			roman = "MMMM";
			i = 1;
		}
		for (; i < len; ++i)
		{
			k -= 2;
			switch (n[i])
			{
				case "8": roman += numeralLetters[k+1];
				case "3": roman += numeralLetters[k];
				case "2": roman += numeralLetters[k];
				case "1": roman += numeralLetters[k]; break;

				case "4": roman += numeralLetters[k]
				case "5": roman += numeralLetters[k+1]; break;

				case "6": roman += numeralLetters[k+1] + numeralLetters[k]; break;
				case "7": roman += numeralLetters[k+1] + numeralLetters[k] + numeralLetters[k]; break;

				case "9": roman += numeralLetters[k] + numeralLetters[k+2]; break;
			}
		}
		document.insertText(view.cursorPosition(), roman);
	}
	else
		debug("Invalid parameter: 0 <= n <= 4999")
}

function help(cmd)
{
	if (cmd === "romanNumeral")
		return i18n("Écrit un nombre dans sa forme romaine. A partir de 3999 les résultats peuvent être erronés. Si le nombre n'est pas compris entre 0 et 4999 la fonction ne fait rien.<br/><br/>romanNumeral(n: Number)");
}

