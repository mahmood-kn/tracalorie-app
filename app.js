//Storage Ctrl
const StorageCtrl = (function () {
  return {
    addItems: function (newItem) {
      let items;
      if (localStorage.getItem('items') === null) {
        items = [];
        items.push(newItem);
      } else {
        items = JSON.parse(localStorage.getItem('items'));
        items.push(newItem);
      }
      localStorage.setItem('items', JSON.stringify(items));
    },
    getItems: function () {
      let items;
      if (localStorage.getItem('items') === null) {
        items = [];
      } else {
        items = JSON.parse(localStorage.getItem('items'));
      }
      return items;
    },
    updatedItem: function (name, calories) {
      let items = JSON.parse(localStorage.getItem('items'));
      const current = ItemCtrl.logData().currentItem;
      items.forEach((item) => {
        if (item.id === current.id) {
          item.name = name;
          calories = parseInt(calories);
          item.calories = calories;
        }
        localStorage.setItem('items', JSON.stringify(items));
      });
    },
    deleteItem: function () {
      let items = JSON.parse(localStorage.getItem('items'));
      const current = ItemCtrl.logData().currentItem;
      items.forEach((item, index) => {
        if (item.id === current.id) {
          items.splice(index, 1);
        }
        localStorage.setItem('items', JSON.stringify(items));
      });
    },
    clearItems: function () {
      localStorage.removeItem('items');
    },
  };
})();
//Item Ctrl
const ItemCtrl = (function () {
  const Item = function (id, name, calories) {
    this.id = id;
    this.name = name;
    this.calories = calories;
  };

  const data = {
    items: StorageCtrl.getItems(),
    currentItem: null,
    totalCalories: 0,
  };
  // Public
  return {
    logData: function () {
      return data;
    },
    getItems: function () {
      return data.items;
    },
    addItem: function (name, calories) {
      // console.log(name, calories);
      let ID;

      if (data.items.length > 0) {
        ID = data.items[data.items.length - 1].id + 1;
      } else {
        ID = 0;
      }
      calories = parseInt(calories);
      newItem = new Item(ID, name, calories);
      data.items.push(newItem);

      return newItem;
    },
    getTotalCalories: function () {
      let total = 0;
      data.items.forEach((item) => {
        total += item.calories;
      });
      data.totalCalories = total;
      return data.totalCalories;
    },
    clearCurrent: function () {
      data.currentItem = null;
    },
    getEditItem: function (editItem) {
      let rightItem;
      data.items.forEach((item) => {
        if (`item-${item.id}` === `${editItem.id}`) {
          rightItem = item;
        }
      });
      data.currentItem = rightItem;
      return rightItem;
    },
    UpdatedItem: function (name, calories) {
      data.currentItem.name = name;
      calories = parseInt(calories);
      data.currentItem.calories = calories;
    },
    getDeleteItem: function () {
      const delItem = data.currentItem;
      data.items.forEach((item, index) => {
        if (item.id === delItem.id) {
          data.items.splice(index, 1);
        }
      });
    },
    clearItems: function () {
      data.items = [];
      data.totalCalories = 0;
    },
  };
})();
//UI Ctrl
const UICtrl = (function () {
  const UISelectors = {
    itemList: '#item-list',
    addBtn: '.add-btn',
    updateBtn: '.update-btn',
    deleteBtn: '.delete-btn',
    backBtn: '.back-btn',
    clearBtn: '.clear-btn',
    itemCalories: '#item-calories',
    itemName: '#item-name',
    totalCalories: '.total-calories',
  };
  // Public
  return {
    populateItems: function (items) {
      let html = '';
      items.forEach((item) => {
        html += `
          <li class="collection-item" id="item-${item.id}">
            <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
            <a href="#" class="secondary-content">
              <i class="edit fa fa-pencil"></i>
            </a>
          </li>
        `;
      });
      document.querySelector(UISelectors.itemList).innerHTML = html;
    },
    getSelectors: function () {
      return UISelectors;
    },
    getItemInput: function () {
      return {
        name: document.querySelector(UISelectors.itemName).value,
        calories: document.querySelector(UISelectors.itemCalories).value,
      };
    },
    addNewItemToList: function (newItem) {
      document.querySelector(UISelectors.itemList).style.display = 'block';

      const li = document.createElement('li');
      li.className += 'collection-item';
      li.id = `item-${newItem.id}`;

      li.innerHTML = `
      <strong>${newItem.name}: </strong> <em>${newItem.calories} Calories</em>
      <a href="#" class="secondary-content">
        <i class="edit fa fa-pencil"></i>
      </a>
     `;
      document.querySelector(UISelectors.itemList).appendChild(li);
    },
    clearFields: function () {
      document.querySelector(UISelectors.itemName).value = '';
      document.querySelector(UISelectors.itemCalories).value = '';
    },
    hideUl: function () {
      document.querySelector(UISelectors.itemList).style.display = 'none';
    },
    showTotalCalories: function (totalCalories) {
      document.querySelector(UISelectors.totalCalories).textContent = totalCalories;
    },
    defultBtns: function () {
      document.querySelector(UISelectors.addBtn).style.display = 'inline';
      document.querySelector(UISelectors.updateBtn).style.display = 'none';
      document.querySelector(UISelectors.deleteBtn).style.display = 'none';
      document.querySelector(UISelectors.backBtn).style.display = 'none';
    },
    editBtns: function () {
      document.querySelector(UISelectors.addBtn).style.display = 'none';
      document.querySelector(UISelectors.updateBtn).style.display = 'inline';
      document.querySelector(UISelectors.deleteBtn).style.display = 'inline';
      document.querySelector(UISelectors.backBtn).style.display = 'inline';
    },
    inputEditMode: function (item) {
      document.querySelector(UISelectors.itemName).value = item.name;
      document.querySelector(UISelectors.itemCalories).value = item.calories;
    },
    removeList: function () {
      document.querySelector(UISelectors.itemList).innerHTML = '';
      document.querySelector(UISelectors.totalCalories).textContent = 0;
    },
  };
})();
//App
const App = (function (ItemCtrl, UICtrl, StorageCtrl) {
  const eventListeners = function () {
    const UISelectors = UICtrl.getSelectors();
    const itemAddSubmit = function (e) {
      e.preventDefault();
      const input = UICtrl.getItemInput();
      if (input.name !== '' && input.calories !== '') {
        const newItem = ItemCtrl.addItem(input.name, input.calories);

        StorageCtrl.addItems(newItem);

        UICtrl.addNewItemToList(newItem);

        UICtrl.clearFields();

        const totalCaloties = ItemCtrl.getTotalCalories();

        UICtrl.showTotalCalories(totalCaloties);
      }
    };

    const editItem = function (e) {
      e.preventDefault();

      if (e.target.classList.contains('edit')) {
        UICtrl.editBtns();

        const itemToEdit = ItemCtrl.getEditItem(e.target.parentElement.parentElement);
        UICtrl.inputEditMode(itemToEdit);
      }
    };

    const backFromEdit = function (e) {
      e.preventDefault();
      UICtrl.defultBtns();
      UICtrl.clearFields();
      ItemCtrl.clearCurrent();
    };

    const getUpdatedItem = function (e) {
      e.preventDefault();

      const input = UICtrl.getItemInput();

      ItemCtrl.UpdatedItem(input.name, input.calories);

      StorageCtrl.updatedItem(input.name, input.calories);

      UICtrl.defultBtns();
      UICtrl.clearFields();

      const items = ItemCtrl.getItems();
      UICtrl.populateItems(items);

      const totalCaloties = ItemCtrl.getTotalCalories();
      UICtrl.showTotalCalories(totalCaloties);
    };

    const deleteItem = function (e) {
      e.preventDefault();
      ItemCtrl.getDeleteItem();
      UICtrl.clearFields();
      StorageCtrl.deleteItem();
      ItemCtrl.clearCurrent();
      UICtrl.defultBtns();
      const items = ItemCtrl.getItems();
      if (ItemCtrl.getItems().length === 0) {
        UICtrl.hideUl();
      } else {
        UICtrl.populateItems(items);
      }

      ItemCtrl.getTotalCalories();
      const totalCaloties = ItemCtrl.getTotalCalories();
      UICtrl.showTotalCalories(totalCaloties);
    };
    const clearItems = function (e) {
      e.preventDefault();
      ItemCtrl.clearItems();
      StorageCtrl.clearItems();
      UICtrl.removeList();
      UICtrl.hideUl();
    };
    document.querySelector(UISelectors.addBtn).addEventListener('click', itemAddSubmit);
    document.querySelector(UISelectors.itemList).addEventListener('click', editItem);
    document.querySelector(UISelectors.backBtn).addEventListener('click', backFromEdit);
    document.querySelector(UISelectors.updateBtn).addEventListener('click', getUpdatedItem);
    document.querySelector(UISelectors.deleteBtn).addEventListener('click', deleteItem);
    document.querySelector(UISelectors.clearBtn).addEventListener('click', clearItems);
    document.addEventListener('keypress', (e) => {
      if (e.keyCode === 13 || e.which === 13) {
        e.preventDefault();
        return false;
      }
    });
  };
  //Public
  return {
    init: function () {
      const totalCaloties = ItemCtrl.getTotalCalories();

      UICtrl.showTotalCalories(totalCaloties);

      UICtrl.defultBtns();

      const items = ItemCtrl.getItems();
      if (ItemCtrl.getItems().length === 0) {
        UICtrl.hideUl();
      } else {
        UICtrl.populateItems(items);
      }

      eventListeners();
    },
  };
})(ItemCtrl, UICtrl, StorageCtrl);

App.init();
