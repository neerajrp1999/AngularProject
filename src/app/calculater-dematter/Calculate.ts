

export class Calculator {
    stack: any = [];
    num: any = 0;
    res: any = 0;
    buff: any = [false, false];

    curr: any = true;

    rank: any = {
        ': any =': 0,
        '+': 1, '-': 1,
        '/': 2, '*': 2,
        'yx': 3, 'x√y': 3, 'EE': 3
    };

    calc(key: any, val: any) {
		var rank = this.rank;

		if (key === '%') {
			this.curr = 'funk';
			return (this.stack[0] ? this.stack[this.num - 1][0] / 100 * val : val / 100) + '';
		}
		key = key.replace('×', '*').replace('÷', '/').replace('–', '-');
		if (key !== '=') {
			this.buff[1] = key;
		} else if (this.buff[0] === false) {
			this.buff[0] = val; // feed buffer for repeating '='
		}
		if (key === '=' && !this.stack[0] && this.curr && this.buff[1]) { // repeating '='
			return (this.buff[1] === 'yx' ? Math.pow(val, this.buff[0]) : this.buff[1] === 'x√y' ?
				Math.pow(val, 1 / this.buff[0]) : this.buff[1] === 'EE' ? val * Math.pow(10, this.buff[0]) :
				eval('(' + val + ')' + this.buff[1] + '(' + this.buff[0] + ')')) + '';
		}
		if (!this.stack[0] && key !== '=') { // first filling
			this.buff[0] = false;
			this.stack[this.num++] = [val, key];
			this.curr = true;
			return val + '';
		}
		if (this.stack[0] && this.curr && this.curr !== 'funk' && key !== '=') { // retyping / correcting operant
			this.stack[this.num - 1] = [val, key];
			return val + ''
		}
		if (!this.stack[0]) {
			return val + '';
		}
		if (rank[key] <= rank[this.stack[this.num - 1][1]]) {
			this.stack[this.num - 1] = [
				this.stack[this.num - 1][1] === 'yx' ? Math.pow(this.stack[this.num - 1][0], val) :
				this.stack[this.num - 1][1] === 'x√y' ? Math.pow(this.stack[this.num - 1][0], 1 / val) :
				this.stack[this.num - 1][1] === 'EE' ? this.stack[this.num - 1][0] * Math.pow(10, val) :
					eval('(' + this.stack[this.num - 1][0] + ')' + this.stack[this.num - 1][1] + '(' + val + ')'),
				key
			];
		}
		if (rank[key] > rank[this.stack[this.num - 1][1]]) {
			this.stack[this.num++] = [val, key];
		} else if (this.stack[this.num - 2] && rank[key] <= rank[this.stack[this.num - 2][1]]) {
			this.calc(key, this.stack[--this.num][0]);
		}
		this.res = (this.stack[this.num - 1] ? this.stack[this.num - 1][0] : this.res) + '';
		if (key === '=') {
			this.init('AX');
		}
		this.curr = true;
		return this.res;
	}

    init(key: any) {
		if (key.match(/A/)) {
			this.stack = [];
			this.num = 0;
		};
		if (key === 'AC') {
			this.buff = [false, false];
		}
		return '0';
	}
};
