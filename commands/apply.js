/* kate-script
 * author: Jonathan Poelen <jonathan.poelen@gmail.com>
 * license: LGPL
 * revision: 1
 * kate-version: 4
 * type: commands
 * functions: call, apply, applyLine, applyLeft, applyLineLeft, applyForLine, applyShift, applyShiftLeft
 */

require("getCommandOrThrowError.js")
require("selectionOrLine.js")
require("selectionOrLine.js")
require("stringOrRegex.js")
require("array-utils.js")
require("range.js")
require("edit.js")


function lineSelection(selection, cursor)
{
  selection = selection || view.selection();
  var n = (selection.end.line - selection.start.line + 1);
  return (cursor||view.cursorPosition()).equals(selection.end) ? -n : n;
}


function call(delimiter, command)
{
  getCommandOrThrowError(command).apply(null, $A(arguments, 2).concat(
    selectionOrLine(false, true).text.split(stringOrRegex(delimiter)).filter(function(v){
      return v.trim();
    })
  ));
}


function _apply(command, step, args, isLeft)
{
  var heigth = 1, line,
    hasSelection = view.hasSelection(),
    pos, setCur;
  if (hasSelection)
  {
    var selection = view.selection();
    line = selection.start.line;
    heigth += selection.end.line - line;
    var columnStart = selection.start.column
    var column = selection.end.column;
    if (isLeft)
      column = document.lineLength(selection.end.line) - column;

    setCur = function(pos){
      selection.start.line = pos;
      selection.start.column = columnStart;
      selection.end.line = pos + heigth - 1;
      selection.end.column = isLeft ? document.lineLength(pos + heigth - 1) - column : column;
      view.setSelection(selection);
      view.setCursorPosition(selection.end);
    }
  }
  else
  {
    var cursorPosition = view.cursorPosition();
    line = cursorPosition.line;
    if (isLeft)
    {
      var column = document.lineLength(line) - cursorPosition.column;
      setCur = function(pos){
        view.setCursorPosition(pos, document.lineLength(pos) - column);
        view.clearSelection();
      };
    }
    else
    {
      setCur = function(pos){
        view.setCursorPosition(pos, cursorPosition.column);
        view.clearSelection();
      };
    }
  }

  if ("" === step[0]){
    step = [-step[1], step[2]];
  }
  if (isNaN(pos = +step[0]) || !pos)
    return ;
  step = +step[1] || 0;
  var isNegative = false;
  if (pos < 0){
    isNegative = true;
    if (-1 === (pos = Math.max(line + (step + 1) * pos + (step && step + 1), -1))){
      pos += step + 1;
      isNegative = pos < 0;
    }
  } else {
    pos = line + (heigth + step) * Math.min(pos, (document.lines() - line) / (heigth + step)) - (step && step + 1);
  }

  edit(
    isNegative ? function(line, pos, setCur){
      while (line >= pos)
      {
        setCur(pos);
        command.apply(null, args);
        pos += 1 + step;
      }
    } : function(line, pos, setCur){
      while (line <= pos)
      {
        setCur(pos);
        command.apply(null, args);
        pos -= heigth + step;
      }
    },
    [line, (step ? pos : isNegative ? pos + 1 : pos - 1) - (hasSelection && 1 !== heigth), setCur]
  );
}


["apply", "applyLeft"].forEach(function(name, isLeft){
  window[name] = function(step, command/*, args…*/) {
    _apply(
      getCommandOrThrowError(command),
      step.split(/[^\d]/),
      $A(arguments, 2),
      isLeft
    );
  }
});

function _reorderedForApplyShift(args, p, numarg){
  args = $A(args, p);
  if (numarg === 1)
    return args.reverse();
  var end = args.length;
  var n = end % numarg;
  var r = n ? args.slice(-n) : [];
  end -= n;
  while (end > 0){
    for (n = end - numarg; n != end; ++n)
      r.push(args[n]);
    end -= numarg;
  }
  return r;
}

["applyShift", "applyShiftLeft"].forEach(function(name, isLeft){
  window[name] = function(/*[step, ]_shift, command, args…*/) {
    var p = 3, step, _shift, command;
    if (!(/^\d/).test(arguments[1])){
      --p;
      _shift = arguments[0];
      command = arguments[1];
    }
    else
    {
      step = arguments[0];
      _shift = arguments[1];
      command = arguments[2];
    }
    command = getCommandOrThrowError(command);
    var shift = _shift.split(/[^\d]/);
    var func, numarg, args;
    if ((numarg = +shift[1])){
      var nconstant = +shift[0];
      var constantargs = $A(arguments, p, p + nconstant);
      args = _reorderedForApplyShift(arguments, p + nconstant, numarg);
      func = _shift.indexOf('-') === -1 ? function(){
        return constantargs.concat(args.slice(0, numarg));
      } : function(){
        return args.slice(0, numarg).concat(constantargs);
      }
    }
    else if ((numarg = +shift[0])){
      args = _reorderedForApplyShift(arguments, p, numarg);
      func = function(){
        return args.slice(0, numarg);
      }
    }
    else
      return ;
    var l = Math.floor(args.length/numarg);
    if (3 === p){
      var _step = +step;
      if (_step)
        step = [l, _step];
      else {
        step = step.split(/[^\d]/)
        if (!step[0])
          step[0] = l;
      }
    } else
      step = [l];
    _apply(function(){
        command.apply(null, func(args));
        for (var n = numarg; n--; )
          args.shift();
      },
      step, null, isLeft
    );
  }
});


["applyLine", "applyLineLeft"].forEach(function(name, isLeft){
  window[name] = function(command/*, args…*/){
    command = getCommandOrThrowError(command);
    if (view.hasSelection())
    {
      view.clearSelection();
      _apply(
        command,
        [lineSelection()],
        $A(arguments, 1),
        isLeft
      );
    }
    else {
      command.apply(null, $A(arguments, 1))
    }
  }
});


function applyForLine(command/*, args…*/)
{
  if (!view.hasSelection())
    return;
  command = getCommandOrThrowError(command);
  var args = $A(arguments, 1);
  args.push(""+lineSelection());
  view.clearSelection();
  command.apply(null, args);
}

function help(cmd)
{
  if (cmd === "call")
    return i18n("Exécute command avec le texte de la sélection ou de la ligne, couper en fragments séparés par delimiter. Les paramètres suivant le delimiter seront ajoutés aux paramètres de command suivis des fragments.\
<br/><br/>call(delimiter: String|RegExp, command: String, [params: mixed, …]\")\
<br/><br/>exemple:\
<br/>0 1 2 3\
<br/>$ call '' replace 'a[i] = 0;\\n' i\
<br/>a[0] = 0;<br/>\
a[1] = 0;<br/>\
a[2] = 0;<br/>\
a[3] = 0;<br/>");

  if (cmd === "apply")
    return i18n("Applique command en bougeant le curseur ou la sélection de step lignes vers le bas. Les paramètres supplémentaires seront envoyés à command.\
<br/><br/>apply(step: Number|String= 0, command: String, [params: mixed, …]\")\
<br/>step: Si step est de la forme n1-n2, où '-' représente des caractères non numériques, alors n2 représente le nombre de lignes à descendre sans faire command et n1 le step. step représente le nombre de lignes à descendre.\
<br/><br/>exemple:\
<br/>big<br/>\
bada<br/>\
bo${cursor}um\
<br/>$ apply 3 duplicate 2\
<br/>big<br/>\
big<br/>\
bada<br/>\
bada<br/>\
boum<br/>\
boum");

  if (cmd === "applyForLine")
    return i18n("Compte le nombre de ligne et le passe en dernier paramètre à command.\
<br/><br/>applyForLine(command: String, [params: mixed, …]\")");

  if (cmd === "applyLeft")
    return i18n("Identique à apply mais lorsque le cursor ou la sélection ce déplace, le nombre de caractères à gauche reste identique.\
<br/><br/>applyLeft(step: Number|String= 0, command: String, [params: mixed, …]\")");

  if (cmd === "applyLine")
    return i18n("Compte le nombre de ligne de la sélection et le passe en premier paramètre à apply. S'il n'y a pas de sélection command est directement appelé.\
<br/><br/>applyLine(command: String, [params: mixed, …]\")");

  if (cmd === "applyLineLeft")
    return i18n("Compte le nombre de ligne de la sélection et le passe en premier paramètre à applyLeft. S'il n'y a pas de sélection command est directement appelé.\
<br/><br/>applyLineLeft(command: String, [params: mixed, …]\")");
}
