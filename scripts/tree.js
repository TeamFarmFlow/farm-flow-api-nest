const fs = require('node:fs');
const path = require('node:path');

class Node {
  name;
  depth = 0;
  children = [];

  constructor(name, depth = 0) {
    this.name = name;
    this.depth = depth;
    this.children = [];
  }

  pointer(isLast) {
    if (this.depth === 0) {
      return '';
    }

    if (isLast) {
      return '└─ ';
    } else {
      return '├─ ';
    }
  }

  prefix(prefix, isLast) {
    if (this.depth === 0) {
      return '';
    }

    if (isLast) {
      return prefix + '   ';
    } else {
      return prefix + '│  ';
    }
  }

  print(prefix = '', isLast = true) {
    console.log(prefix + this.pointer(isLast) + this.name);
    this.printChildren(this.prefix(prefix, isLast));
  }

  printChildren(prefix) {
    const children = [...this.children];

    while (children.length > 0) {
      const child = children.shift();

      if (!child) {
        break;
      }

      child.print(prefix, children.length === 0);
    }
  }

  static scan(dirPath, parent) {
    const items = fs.readdirSync(dirPath, { withFileTypes: true });

    while (items.length > 0) {
      const item = items.shift();

      if (!item) {
        break;
      }

      const node = new Node(item.name, parent ? parent.depth + 1 : 0);

      if (parent) {
        parent.children.push(node);
      }

      if (item.isDirectory()) {
        Node.scan(path.join(dirPath, item.name), node);
      }
    }

    return parent;
  }
}

const ROOT = path.resolve(__dirname, '..');

Node.scan(path.resolve(ROOT, 'src'), new Node('src')).print();
