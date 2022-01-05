import '../styles/index.scss';
import json from '../data.json';

const result = document.querySelector('#result-div');
const button = document.createElement('button');

const storage = {
  val1: 0,
  val2: 0,
  items: [],
  ul: document.createElement('ul'),
  mainBlock: document.querySelector('.main'),
  saveRes: document.createElement('div'),

  appendItem(parent, children, method = 'append') {
    // eslint-disable-next-line no-unused-expressions
    method === 'prepend' ? parent.prepend(children) : parent.append(children);
  },

  valSum() {
    return +this.val1 + +this.val2;
  },

  preinit() {
    const container = document.querySelector('.container');
    const allResults = document.createElement('div');
    const list = document.createElement('ul');
    allResults.id = 'allResults';
    this.appendItem(container, this.saveRes, 'prepend');
    this.appendItem(allResults, list);
    this.appendItem(this.mainBlock, allResults);
    this.appendItem(this.mainBlock, this.ul);
  },

  init(args) {
    this.createLoader();
    args.forEach(({ value, id }) => storage.addItem({ value, id }));

    this.deleteLoader();
  },

  createLoader() {
    const loadingDiv = document.createElement('div');
    loadingDiv.classList.add('loading');
    loadingDiv.innerHTML = `<div class='loading-text'>
      <span class='loading-text-words'>L</span>
      <span class='loading-text-words'>O</span>
      <span class='loading-text-words'>A</span>
      <span class='loading-text-words'>D</span>
      <span class='loading-text-words'>I</span>
      <span class='loading-text-words'>N</span>
      <span class='loading-text-words'>G</span>
      </div>`;

    this.appendItem(this.mainBlock, loadingDiv);
  },

  deleteLoader() {
    const loadingAnimation = document.querySelector('.loading');
    this.mainBlock.removeChild(loadingAnimation);

    return this.mainBlock;
  },

  generateId() {
    return Math.floor(Math.random() * 100);
  },

  save(key, val) {
    this[key] = val;
  },

  update(key, val) {
    this.save(key, val);
    this.printCurrentResult();
  },

  printCurrentResult() {
    result.innerHTML = `Результат сложения: ${this.valSum()}`;
  },

  generateButtonDelete() {
    const buttonDelete = document.createElement('button');
    buttonDelete.innerHTML = `<i class='fas fa-backspace'></i>`;
    buttonDelete.className = 'delete';

    updateElementStyles(buttonDelete, {
      backgroundColor: 'darkmagenta',
      color: 'antiquewhite',
      border: '1px solid',
      borderRadius: '20%',
    });

    return buttonDelete;
  },

  createItem({ value, id }) {
    const item = {
      element: document.createElement('li'),
      id: id || this.generateId(),
      value: value || this.valSum(),
      button: this.generateButtonDelete(),
    };
    item.element.setAttribute('data-id', item.id);
    item.element.innerHTML = item.value;
    item.element.appendChild(item.button);
    item.button.addEventListener('click', (e) => {
      const parent = e.currentTarget.parentNode;
      this.removeItem(parent);
      parent.remove();
    });

    return item;
  },

  addItem(value) {
    const item = this.createItem({ value: value.value, id: value.id });

    updateElementStyles(item.element, {
      listStyle: 'none',
      width: '20%',
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      fontSize: '40px',
      margin: '1% 1% 1% 0',
      border: '1px solid khaki',
      backgroundColor: 'goldenrod',
      padding: '5px 10px',
      borderRadius: '13px',
    });

    this.items.push({ id: item.id, value: item.value.value });

    this.ul.appendChild(item.element);
  },

  removeItem(itemId) {
    const attribute = itemId.getAttribute('data-id');

    const item = this.items.find((i) => i.id === attribute);

    if (item) {
      this.ul.removeChild(itemId);
      const index = this.items.indexOf(item);
      if (index > -1) {
        this.items.splice(index, 1);
      }
      if (this.items.length === 0) {
        this.createLoader();
      }
      return this.items;
    }
  },

  createModal(args) {
    // main.append(wrapperModal);
    const modal = document.createElement('div');
    const wrapperModal = document.createElement('div');
    this.appendItem(this.mainBlock, wrapperModal);
    button.innerText = 'Ok';
    wrapperModal.append(button, modal);
    button.addEventListener('click', (e) => {
      const parent = e.currentTarget.parentNode;
      parent.remove();
    });
    modal.innerText = args;
    updateElementStyles(wrapperModal, {
      position: 'fixed',
      top: 0,
      right: 0,
      left: 0,
      bottom: 0,
      backgroundColor: '#860d3fa6',
    });
    updateElementStyles(button, {
      margin: '26% 0 0 68%',
      position: 'fixed',
    });
    updateElementStyles(modal, {
      padding: '20px',
      border: '5px solid #866a0d83',
      textAlign: 'center',
      borderRadius: '10px',
      backgroundColor: '#ffda00ad',
      color: '#6c0a30',
      boxShadow: '5px 10px 5px #a0924552',
      margin: '25% auto',
      width: '750px',
    });
  },

  localStorageCustom(action, { key, entity = '' }) {
    if (key) {
      switch (action) {
        case 'set':
          localStorage.setItem(key, entity);
          break;
        case 'get':
          localStorage.getItem(key);
          break;
        default:
          this.createModal('Метод не определен');
          break;
      }
    } else if (!key) {
      this.createModal('Ключ не задан');
    }
  },
};

function updateElementStyles(el, propsObj, id) {
  id && (el.id = id);

  for (let key in propsObj) {
    el.style.hasOwnProperty(key) && (el.style[key] = propsObj[key]);
  }
}

storage.localStorageCustom('get', { key: 'test', entity: 'testing' });

updateElementStyles(
  storage.saveRes,
  {
    height: '100px',
    width: '100px',
    backgroundColor: 'crimson',
    border: '1px solid khaki',
    borderRadius: '13px',
    marginRight: '10px',
  },
  'saveRes'
);

storage.preinit();
document.querySelector('#input1').addEventListener('keyup', ({ target: { value } }) => {
  storage.update('val1', value);
});
document.querySelector('#input2').addEventListener('keyup', ({ target: { value } }) => {
  storage.update('val2', value);
});
document.querySelector('#saveRes').addEventListener('click', () => storage.addItem(storage.valSum));
storage.init(json);
