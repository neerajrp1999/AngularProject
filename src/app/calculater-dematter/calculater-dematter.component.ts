import { Component, OnInit } from '@angular/core';
import { Calculator } from './Calculate';

@Component({
  selector: 'app-calculater-dematter',
  templateUrl: './calculater-dematter.component.html',
  styleUrls: ['./calculater-dematter.component.css']
})
export class CalculaterDematterComponent implements OnInit {

  calcSS3: any;
  display: any;
  radDeg: any;
  smallerButton: any;
  hold: any;
  lnButton: any;
  helpButton: any;
  secondKeySet: any[] = [];
  hiddenCopy: any;
  keyBoard: any = {};
  pressedKey: any;
  frozenKey: any; // active calculation keys
  secondActive: any = false; // 2nd key active?
  bracketKey: any;
  brackets: any = 0; // count of current open brackets
  calculator: any = []; // instances of Calculator
  deg: any = false; // Deg mode or Rad
  memory: any = 0;
  resBuffer: any = '0';
  bigger: any = false; // app size
  ln: any = 0;
  buffStr: any = [];
  sav: any = ['secondActive', 'deg', 'memory', 'buffStr', 'resBuffer'];

  secondLayer = [
    ['sin', 'cos', 'tan', 'ln', 'sinh', 'cosh', 'tanh', 'e<sup>x</sup>'],
    [
      'sin<sup>-1</sup>', 'cos<sup>-1</sup>', 'tan<sup>-1</sup>', 'log<sub>2</sub>',
      'sinh<sup>-1</sup>', 'cosh<sup>-1</sup>', 'tanh<sup>-1</sup>', '2<sup>x</sup>'
    ]
  ];

  constructor() { }

  localStroage(localStorage: any) {
    if (!localStorage || !localStorage['resBuffer']) {
      return; // for the very first run or after fatal crash
    }
    this.bigger = localStorage['bigger'] ? eval(localStorage['bigger']) : true;
    this.toggleCalc();
    if (+localStorage['ln']) {
      this.ln = localStorage['ln'];
      this.switchGrouping();
    }
    try {
      if (localStorage['secondActive'].match(/false|null/) ? false : true) {
        this.keyDown(false, this.keyBoard['2nd']);
        this.doKey('2nd', true);
      }
      if (eval(localStorage['deg'])) this.doKey('Deg', true);
      if (localStorage['memory']) {
        this.render(localStorage['memory']);
        this.doKey('m+', true);
      }
      this.render(localStorage['resBuffer']);
      let buffStrX = localStorage['buffStr'].split(',');
      for (let n = 0, m = buffStrX.length; n < m; n++) {
        if (buffStrX[n]) this.doKey(buffStrX[n], true);
      }
      this.render(localStorage['resBuffer']);
      this.resBuffer = localStorage['resBuffer'];
    } catch (e) {
      for (let n = this.sav.length; n--;) {
        localStorage.removeItem(this.sav[n]);
      }
    }
  }

  ngOnInit() {

    this.calcSS3 = document.querySelector('.calc-main');
    this.display = this.calcSS3.querySelector('.calc-display span');
    this.radDeg = this.calcSS3.querySelector('.calc-rad');
    this.smallerButton = this.calcSS3.querySelector('.calc-smaller');
    this.hold = this.calcSS3.querySelector('.calc-hold');
    this.lnButton = this.calcSS3.querySelector('.calc-ln');
    this.helpButton = this.calcSS3.querySelector('.calc-info');
    this.secondKeySet = [].slice.call(this.calcSS3.querySelector('.calc-left').children, 12, 20);
    this.hiddenCopy = this.calcSS3.querySelector('textarea');


    for (let k = 2; k--;) {
      for (let l = this.calcSS3.children[k + 1], m = l.children, n = m.length; n--;) {
        this.keyBoard[l.children[n].textContent.replace(/\s*/g, '')] = l.children[n];
      }
    }
    this.keyBoard['C'] = this.keyBoard['AC'];
    this.keyBoard['Rad'] = this.keyBoard['Deg'];
    for (let m: any = this.secondLayer[0], n = m.length; n--;) {
      this.keyBoard[this.secondLayer[1][n].replace(/<\/*\w+>/g, '')] = this.keyBoard[m[n]];
    }
    this.keyBoard['2x'] = this.keyBoard['ex'];

    this.calculator[0] = new Calculator();

    this.localStroage(window.localStorage);

    // ---------------- event listeners keys ---------------- //

    document.addEventListener('keypress', e => {
      let key: any = e.which,
        holdKey = this.hold.textContent,
        keyMatch = (',|.|-|–|/|÷|*|×|#|+/–|x|x!|E|EE|e|ex| |2nd|r|x√y|R|√|p|π|^|yx|\'|yx|"|yx|m|mr|v|mc|b|m+|n|m-|' +
          's|sin|c|cos|t|tan|S|sin-1|C|cos-1|T|tan-1|d|Deg|°|Deg|l|ln|L|log|\\|1/x|X|2x').split('|'),
        keyMatchHold = ('sin|sinh|cos|cosh|tan|tanh|m-|Rand|Deg|Rand|sin-1|sinh-1|cos-1|cosh-1|tan-1|tanh-1|' +
          '1|1/x|2|x2|3|x3|x√y|√|ln|log2|ex|2x').split('|');

      if (key === 13) key = 61;
      key = String.fromCharCode(key);
      for (let n = 0, m = keyMatch.length; n < m; n = n + 2)
        if (key === keyMatch[n]) {
          key = key.replace(key, keyMatch[n + 1]);
          break
        }
      if (holdKey) {
        for (let n = 0, m = keyMatchHold.length; n < m; n = n + 2)
          if (key == keyMatchHold[n]) {
            key = key.replace(key, keyMatchHold[n + 1]);
            break
          }
        this.hold.textContent = '';
      }
      if ((key === 'h' || key === 'H') && !holdKey) this.hold.textContent = 'hold';
      if (key === 'G' && holdKey) this.switchGrouping(true);
      if (!this.keyBoard[key]) return false;
      if ((key.match(/-1$|log2$|2x$/) && !this.secondActive) || (key.match(/h$|n$|cos$|ex$/) && this.secondActive)) {
        this.keyDown(false, this.keyBoard['2nd']);
        this.doKey('2nd', true);
      }
      this.keyDown(false, this.keyBoard[key]);
      this.doKey(key, true);
      return;
    }, false);

    document.addEventListener('keydown', e => {
      let str = this.resBuffer.replace(/\s/g, ''),
        strLen = str.split('').length - 1;

      this.toggleOptions();
      if (e.which === 8 && this.calculator[this.brackets].curr !== true &&
        this.calculator[this.brackets].curr !== 'funk' && str !== '0') {
        e.preventDefault();
        while (this.buffStr.length && !this.keyBoard[this.buffStr[this.buffStr.length - 1]]) { // bull shit key(s)
          this.buffStr.pop();
        }
        if (this.buffStr[this.buffStr.length - 1] === '+/–') {
          this.doKey('+/–', true);
          this.buffStr.pop();
        } // +/-
        else if (this.resBuffer.match(/\-\d$/) || this.resBuffer.match(/^\d$/)) {
          this.buffStr.pop();
          this.doKey('C', true);
          this.render('0');
        } else {
          this.render(str.substring(0, strLen), true);
        }
        this.buffStr.pop();
        if (this.buffStr[this.buffStr.length - 1] === '.') {
          this.render(str.substring(0, strLen - 1));
          this.buffStr.pop()
        }
      }
      if (e.which === 220) {
        this.keyDown(false, this.keyBoard['xy']);
      }
      if (e.which === 46) {
        this.keyDown(false, this.keyBoard['AC']);
        this.doKey(this.keyBoard['AC'].textContent, true);
      }
      if (e.which === 9) {
        this.toggleCalc(true);
        e.preventDefault();
      }
    }, false);

    document.addEventListener('keyup', () => {
      this.keyUp();
      this.saveState();
    }, false);

    document.body.addEventListener('paste', e => {
      this.render(parseFloat(e.clipboardData?.getData("Text") + '') + '');
      this.calculator[this.brackets].curr = true;
      this.keyBoard['AC'].children[0].firstChild.data = 'C';
      if (this.frozenKey) this.freezeKey(this.frozenKey, true);
      e.preventDefault();
    }, false);

    document.body.addEventListener('copy', e => {
      this.hiddenCopy.textContent = this.resBuffer.replace(/\s/g, '');
      this.hiddenCopy.focus();
      this.hiddenCopy.select();
    }, false);

    this.calcSS3.addEventListener('mousedown', (e: any) => {
      this.keyDown(e);
      if (!this.pressedKey) return false;
      document.addEventListener('mouseout', this.keyUp, false);
      document.addEventListener('mouseover', this.keyDown, false);
      return false;
    });

    document.addEventListener('mouseup', e => {
      let event = e || window.event,
        target = this.getTargetKey(event.target),
        keyText = target.textContent.replace(/\s*/g, ''),
        key = this.keyBoard[keyText];

      // if (event.target === helpButton) {
      //   window.location = 'http://dematte.at/calculator#usage';
      // }
      if (event.target === this.smallerButton) {
        this.toggleCalc(true);
      }
      if (event.target === this.lnButton) {
        this.switchGrouping(true);
      }
      if (event.target !== this.lnButton) {
        this.toggleOptions();
      }
      document.removeEventListener('mouseout', this.keyUp, false);
      document.removeEventListener('mouseover', this.keyDown, false);
      if (!this.pressedKey) {
        return false;
      }
      if (key) {
        this.doKey(keyText);
        this.saveState();
      }
      return
    }, false);

    this.display.parentElement.addEventListener('dblclick', () => {
      if (!this.helpButton.active) {
        this.toggleCalc(true);
      }
    }, false);

    this.helpButton.addEventListener('mouseover', () => {
      this.toggleOptions(true);
    }, false);

  }

  // ------------------- event related s ------------------ //

  keyDown(e?: any, obj?: any) { // works for mouse and key
    let event = e || window.event,
      target = obj || this.getTargetKey(event.target),
      keyText = target.textContent.replace(/\s*/g, ''),
      key = this.keyBoard[keyText];

    if (key) {
      this.keyUp(); // recover key in case of a javaScript Error
      this.pressedKey = key;
      key.className = key.className + ' calc-press';
    }
    return false;
  }

  getTargetKey(elm: any) {
    while (elm !== this.calcSS3 && elm.parentNode && elm.parentNode.style &&
      !/calc-(?:left|right)/.test(elm.parentNode.className)) {
      elm = elm.parentNode;
    }
    return elm;
  }

  keyUp() {
    if (this.pressedKey && this.pressedKey !== this.secondActive) {
      this.pressedKey.className = this.pressedKey.className.replace(' calc-press', '');
      this.pressedKey = null;
    }
  }

  freezeKey(key: any, del?: any) {
    let obj = (!del || del !== 2) ? this.frozenKey : key;
    if (obj) obj.className = obj.className.replace(' calc-active', '');
    if (!del) {
      key.className = key.className + ' calc-active';
      this.frozenKey = key;
    }
    return obj;
  }

  saveState() {
    for (let n = this.sav.length; n--;) {
      localStorage[this.sav[n]] = eval(this.sav[n]); // oooohhhh, outch...
    }
  }

  toggleOptions(doIt?: any) {
    this.helpButton.active = !!doIt;
  }

  toggleCalc(doIt?: any) {
    let cName = this.calcSS3.className;

    if (doIt) {
      this.bigger = !this.bigger;
    }
    localStorage['bigger'] = this.bigger;
    this.calcSS3.className = this.bigger ?
      cName.replace(' calc-small', '') :
      cName + ' calc-small';
    this.smallerButton.firstChild.data = this.bigger ? '>' : '<';
    this.render(this.resBuffer);
  }

  switchGrouping(doIt?: any) {
    if (doIt) {
      this.ln = ++this.ln > 3 ? 0 : this.ln;
    }
    this.lnButton.firstChild.data = !this.ln ? '.' : this.ln === 1 ? ',' : this.ln === 2 ? ',.' : '.,';
    this.render(this.resBuffer);
    localStorage['ln'] = this.ln;
  }

  render(val: any, inp?: any) {
    let regx = /(\d+)(\d{3})/,
      hasComma = val.match(/\./),
      tmp: any,
      valAbs = Math.abs(+val),
      fontSize = 45,
      displayStyle = this.display.style,
      displayParentStyle = this.display.parentNode.style;

    if (val.match(/NaN|Inf|Error/)) {
      tmp = 'Error';
    } else {
      this.resBuffer = val;
      if (valAbs >= 1e+16) {
        val = (+val).toExponential(13) + '';
      }
      if (!this.bigger && ((!inp || inp === '+/–') && valAbs !== 0)) {
        val = (+val).toPrecision(9);
      }
      tmp = (val + '').split('.');
      if (tmp[1]) {
        tmp[2] = tmp[1].split('e');
        if (tmp[2][1]) {
          tmp[1] = tmp[2][0];
        }
        if (!inp || inp === '+/–') {
          tmp[1] = (((+('1.' + tmp[1])).toPrecision(this.bigger ? 16 : tmp[2][1] ? 7 : 9)) + '');
          if (tmp[1] >= 2) {
            tmp[0] = (+tmp[0] + 1) + '';
          }
          tmp[1] = tmp[1].substr(2).replace(/0+$/, '');
        }
      }
      while (regx.test(tmp[0])) {
        tmp[0] = tmp[0].replace(regx, '$1' + ' ' + '$2');
      }
      tmp = tmp[0] + ((tmp[1] || hasComma) ? '.' + tmp[1] : '').
        replace('.undefined', '').
        replace(inp ? '' : /\.$/, '') + (tmp[2] && tmp[2][1] ? 'e' + tmp[2][1] : '');
    }
    if (this.ln) {
      tmp = tmp.replace(/\./g, '#').
        replace(/\s/g, this.ln === 1 ? ' ' : this.ln === 2 ? ',' : '.').
        replace(/#/g, this.ln === 2 ? '.' : ',');
    }
    this.display.firstChild.data = tmp;
    // for common use: get values of pixels dynamically to stay free from design (...but outside this )
    displayStyle.fontSize = '45px';
    displayParentStyle.lineHeight = '61px';
    while (this.display.offsetWidth > this.display.parentNode.offsetWidth - (this.bigger ? 40 : 30)) {
      displayStyle.fontSize = (fontSize--) + 'px';
      displayParentStyle.lineHeight = (fontSize + 18) + 'px'
    }
  }

  doKey(text: any, alt?: any) {
    let key = this.keyBoard[text]; // text = key.textContent.replace(/\s*/g, '');

    if (text === '2nd') {
      this.secondActive = this.secondActive ? null : true;
      key.className = this.secondActive ? 'calc-press calc-second' : ''; // !!!
      for (let n = this.secondKeySet.length; n--;) {
        this.secondKeySet[n]['children'][0]['innerHTML'] = this.secondLayer[this.secondActive ? 1 : 0][n];
      }
    } else if (text.match(/^[+|–|÷|×|yx|x√y|E]+$/) && text !== '√') {
      this.freezeKey(key);
    } else if (text.match(/^[\d|\.|π]$/)) {
      this.freezeKey(key, true);
      this.keyBoard['AC'].children[0].firstChild.data = 'C';
    } else if (text === 'C') {
      key.children[0].firstChild.data = 'AC';
      if (this.frozenKey) this.freezeKey(this.frozenKey);
    } else if (text.match(/AC|=/)) {
      if (this.bracketKey) this.freezeKey(this.bracketKey, 2);
      this.freezeKey(key, true);
      this.frozenKey = null
    } else if (text.match(/Deg|Rad/)) {
      this.radDeg.firstChild.data = this.deg ? 'Rad' : 'Deg';
      key.children[0].firstChild.data = this.deg ? 'Deg' : 'Rad';
      this.deg = !this.deg
    } else if (text === '(') {
      this.bracketKey = key;
      this.freezeKey(this.bracketKey, 2).className += ' calc-active';
    } else if (text === ')' && this.brackets === 1 && this.bracketKey) {
      this.freezeKey(this.bracketKey, 2);
    } else if (text.match(/^mr$/) && this.memory) {
      this.keyBoard['AC'].children[0].firstChild.data = 'C';
    }

    this.evalKey(text);

    if (!alt) {
      this.keyUp();
    }
    if (text.match(/^m[c|+|-]/)) {
      this.freezeKey(this.keyBoard['mr'], 2).className += (this.memory ? ' calc-active' : '');
    }
  }

  fak(n: number): number {
    return n < 0 || n > 170 ? NaN : n <= 1 ? 1 : n * this.fak(n - 1)
  }

  evalKey(key: any) {
    let dispVal: any = this.resBuffer.replace(/\s/g, '').replace(/Error|∞|-∞/, '0') + '',
      _PI = Math.PI,
      lastKey;

    if (!key.match(/2nd|Deg|Rad|m/)) { // +/- issue
      this.buffStr.push(key);
      if ((this.buffStr[this.buffStr.length - 2] === '=' && key !== '=' &&
        this.calculator[this.brackets].curr) || key === 'AC') {
        this.buffStr = [key];
      }
    }
    lastKey = this.buffStr[this.buffStr.length - 2];
    if (key.match(/^[\d|\.]$/) || key === '+/–') {
      if (this.calculator[this.brackets].curr && key !== '+/–' || (key === '+/–' &&
        lastKey && lastKey.match(/^[+|–|÷|×|yx|x√y|E|^C]+$/))) {
        dispVal = '0';
        this.calculator[this.brackets].curr = false;
      }
      if ((Math.abs(+(dispVal + key)) > (this.bigger ? 1e15 : 1e9) ||
        dispVal.replace(/^-/, '').length > 15 ||
        (dispVal.replace('-', '').replace(/\./g, '').length > (this.bigger ? 14 : 8)) ||
        (dispVal.match(/\.|\e\+/) && key === '.')) && key !== '+/–') {
        this.buffStr.pop();
        return;
      } else if (key === '+/–') {
        this.render(!(dispVal.replace(/e[\+|\-]/, '')).match('-') ?
          '-' + dispVal : dispVal.replace(/^-/, ''), '+/–');
      } else {
        this.render((dispVal + key).replace(/^(-)*?0(\d)$/, '$1' + '$2'), true);
      }
    } else if (key.match(/^C|AC/)) {
      this.render(this.calculator[this.brackets].init(key));
      this.hold.textContent = '';
    } else if (key.match(/^[+|–|÷|×|-|\/|*|yx|x√y|%|E]+$/) && key !== '√') {
      this.render(this.calculator[this.brackets].calc(key, dispVal));
    } else {
      if (this.brackets > -1) {
        this.calculator[this.brackets].curr = 'funk';
      }
      switch (key) {
        case '=':
          while (this.brackets > -1) {
            this.render(dispVal = this.calculator[this.brackets--].calc('=', dispVal));
          }
          this.brackets = 0;
          this.calculator[this.brackets].curr = true;
          break;
        case '(':
          this.calculator[++this.brackets] = new Calculator();
          this.calculator[this.brackets].curr = true;
          break;
        case ')':
          if (this.brackets) {
            this.render(this.calculator[this.brackets--].calc('=', dispVal));
          }
          if (this.brackets > -1) {
            this.calculator[this.brackets].curr = false;
          }
          break;
        case 'mc':
          this.memory = 0;
          break;
        case 'm+':
          this.memory += +dispVal;
          break;
        case 'm-':
          this.memory -= +dispVal;
          break;
        case 'mr':
          this.render(this.memory + '');
          break;
        case '1/x':
          this.render((1 / dispVal) + '');
          break;
        case 'x2':
          this.render(Math.pow(dispVal, 2) + '');
          break;
        case 'x3':
          this.render(Math.pow(dispVal, 3) + '');
          break;
        case 'x!':
          this.render(this.fak(Math.round(+dispVal)) + '');
          break;
        case '√':
          this.render(Math.sqrt(dispVal) + '');
          break;
        case 'log':
          this.render(Math.log(dispVal) / Math.log(10) + '');
          break;
        case 'sin':
          this.render(!this.deg && Math.abs(dispVal) === _PI ? '0' :
            Math.sin(dispVal * (this.deg ? _PI / 180 : 1)) + '');
          break;
        case 'sin-1':
          this.render(Math.asin(dispVal) * (this.deg ? 180 / _PI : 1) + '');
          break;
        case 'cos':
          this.render(Math.cos(dispVal * (this.deg ? _PI / 180 : 1)) + '');
          break;
        case 'cos-1':
          this.render(Math.acos(dispVal) * (this.deg ? 180 / _PI : 1) + '');
          break;
        case 'tan':
          this.render(!this.deg && Math.abs(dispVal) === _PI ? '0' :
            Math.tan(dispVal * (this.deg ? _PI / 180 : 1)) + '');
          break;
        case 'tan-1':
          this.render(Math.atan(dispVal) * (this.deg ? 180 / _PI : 1) + '');
          break;
        case 'ln':
          this.render(Math.log(dispVal) + '');
          break;
        case 'log2':
          this.render(Math.log(dispVal) / Math.log(2) + '');
          break;
        case 'sinh':
          this.render(((Math.pow(Math.E, dispVal) - Math.pow(Math.E, -dispVal)) / 2) + '');
          break;
        case 'sinh-1':
          this.render(Math.log(+dispVal + Math.sqrt(1 + Math.pow(dispVal, 2))) + '');
          break;
        case 'cosh':
          this.render(((Math.pow(Math.E, dispVal) + Math.pow(Math.E, -dispVal)) / 2) + '');
          break;
        case 'cosh-1':
          this.render(2 * Math.log(Math.sqrt((+dispVal + 1) / 2) + Math.sqrt((+dispVal - 1) / 2)) + '');
          break;
        case 'tanh':
          ((e1, e2) => {
            this.render((e1 - e2) / (e1 + e2) + '');
          })(Math.pow(Math.E, dispVal), Math.pow(Math.E, -dispVal));
          break;
        case 'tanh-1':
          this.render((Math.log(+dispVal + 1) - Math.log(1 - dispVal)) / 2 + '');
          break;
        case 'ex':
          this.render(Math.exp(dispVal) + '');
          break;
        case '2x':
          this.render(Math.pow(2, (dispVal)) + '');
          break;
        case 'π':
          this.render(_PI + '');
          break;
        case 'Rand':
          this.render(Math.random() + '');
          break;
        default:
          // this.buffStr.pop();
          break;
      }
    }
  }


}
