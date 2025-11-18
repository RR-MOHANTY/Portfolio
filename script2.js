class Calculator {
  constructor() {
    this.prevEl = document.getElementById('previousOperand');
    this.currEl = document.getElementById('currentOperand');
    this.clear();
    this.bindEvents();
  }

  clear() {
    this.curr = '0';
    this.prev = '';
    this.op = null;
    this.update();
  }

  delete() {
    this.curr = this.curr.slice(0, -1) || '0';
    this.update();
  }

  append(n) {
    if (n === '.' && this.curr.includes('.')) return;
    this.curr = this.curr === '0' && n !== '.' ? n : this.curr + n;
    this.update();
  }

  choose(op) {
    if (!this.curr) return;
    if (this.prev) this.compute();
    this.op = op;
    this.prev = this.curr;
    this.curr = '';
    this.update();
  }

  compute() {
    const a = parseFloat(this.prev), b = parseFloat(this.curr);
    if (isNaN(a) || isNaN(b)) return;
    this.curr = ({
      '+': a + b, '-': a - b, '*': a * b, '/': a / b, '%': a % b
    }[this.op] || '').toString();
    this.op = null;
    this.prev = '';
    this.update();
  }

  format(n) {
    const [int, dec] = n.split('.');
    const i = parseFloat(int);
    return isNaN(i) ? '' : i.toLocaleString('en') + (dec ? '.' + dec : '');
  }

  update() {
    this.currEl.innerText = this.format(this.curr);
    this.prevEl.innerText = this.op ? `${this.format(this.prev)} ${this.op}` : '';
  }

  bindEvents() {
    document.querySelectorAll('.btn-number').forEach(b =>
      b.onclick = () => this.append(b.dataset.number));
    document.querySelectorAll('.btn-operation').forEach(b =>
      b.onclick = () => this.choose(b.dataset.operation));
    document.querySelector('[data-action="equals"]').onclick = () => this.compute();
    document.querySelector('[data-action="clear"]').onclick = () => this.clear();
    document.querySelector('[data-action="delete"]').onclick = () => this.delete();

    document.onkeydown = e => {
      if (/\d/.test(e.key)) this.append(e.key);
      else if (['.', '+', '-', '*', '/'].includes(e.key)) this.choose(e.key);
      else if (e.key === 'Enter' || e.key === '=') this.compute();
      else if (e.key === 'Escape') this.clear();
      else if (e.key === 'Backspace') this.delete();
    };
  }
}

new Calculator();