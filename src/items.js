import { format, formatDistance } from 'date-fns';

const updateSelfFunctionality = (itemInstance, updates) => {
  const updatePropertiesMap = {
    'title': 'setTitle',
    'description': 'setDescription',
    'dueDate': 'setDueDate',
    'priority': 'setPriorityLevel',
    'entries': 'setEntries',
  };
  for (let updateKey in updates) {
    const setterName = updatePropertiesMap[updateKey];
    if (itemInstance[setterName] && typeof itemInstance[setterName] === 'function') {
      itemInstance[setterName](updates[updateKey]);
    }
  }
  itemInstance.notify();
}

const observerFunctionality = () => {
  const observers = [];

  const subscribe = (func) => {
    observers.push(func);
  }

  const notify = () => {
    observers.forEach(func => func())
  }

  return {
    subscribe,
    notify,
  }
}

const noteFunctionality = (title, description) => {

  const getTitle = () => title;
  
  const getDescription = () => description;

  const setTitle = (newTitle) => {
    if (validateTitle(newTitle)) {
      title = newTitle;
      return true;
    }
    return false;
  }

  const setDescription = (newDescription) => {
    if (validateDescription(newDescription)) {
      description = newDescription;
      return true;
    }
    return false;
  }

  const validateTitle = (text) => {
    const MINLENGTH = 1;
    const MAXLENGTH = 32;
    if (text.length > MINLENGTH && text.length < MAXLENGTH) {
      return true;
    }
    return false;
  }

  const validateDescription = (text) => {
    const MINLENGTH = 1;
    const MAXLENGTH = 256;
    if (text.length > MINLENGTH && text.length < MAXLENGTH) {
      return true;
    }
    return false;
  }

  return {
    getTitle,
    getDescription,
    setTitle,
    setDescription,
  }
}


const todoFunctionality = (dueDate, priorityLevel) => {

  const getDueDate = () => new Date(dueDate);

  const getDueDateReadable = () => {
    return format(dueDate, "MMM do, hh:mmaaa");
  }

  const getTimeToDueDate = () => {
    return formatDistance(dueDate, new Date(), {addSuffix: true});
  }

  const getPriorityLevel = () => priorityLevel;

  const setDueDate = (newDueDate) => {
    dueDate = new Date(newDueDate);
  }

  const setPriorityLevel = (newPriorityLevel) => {
    priorityLevel = newPriorityLevel;
    return true;
  }

  const checkDateInPast = (date) => {
    const currentDate = new Date();
    const timeDiff = date.getTime() - currentDate.gettime();
    return (timeDiff < 0) ? true : false;
  }

  return {
    getDueDate,
    getTimeToDueDate,
    getDueDateReadable,
    getPriorityLevel,
    setDueDate,
    setPriorityLevel,
  }
}


const listFunctionality = (entries) => {
  
  const getAllEntries = () => entries;
  
  const addEntry = (newEntry) => {
    if (checkListEntry(newEntry)) {
      entries.unshift(newEntry);
      return true;
    }
    return false;
  }
  
  const removeEntry = (entryToRemove) => {
    if (entries.contains(entryToRemove)) {
      entries = entries.splice(entries.indexOf(entryToRemove, 1));
      return true;
    }
    return false;
  }

  const setEntries = (inputEntries) => {
    const newEntriesList = [];
    for (let newEntry of inputEntries) {
      console.log(newEntry.contents, newEntry.state)
      const newEntryObject = listEntry(newEntry.contents, newEntry.state);
      newEntriesList.unshift(newEntryObject);
    }
    entries = newEntriesList;
  }

  const getListEntriesStorageObject = () => {
    const convertedEntries = [];
    entries.forEach((entry) => {
      convertedEntries.unshift({contents: entry.contents, checked: entry.checked})
    });
    return convertedEntries;
  }
  
  const getEntryCheckedState = (entry) => {
    return !!(entry.checked);
  }
  
  const tickEntry = (entry) => {
    entry.checked = !entry.checked;
  }
  
  return {
    getAllEntries,
    addEntry,
    removeEntry,
    getEntryCheckedState,
    tickEntry,
    setEntries,
    getListEntriesStorageObject,
  }
}

const isEntryFlag = Symbol('ListEntry');

export const listEntry = (contents, checked = false) => {
  return {
    contents,
    checked,
    [isEntryFlag]: true,
  }
}

function checkListEntry(listEntry) {
  return !!(listEntry && listEntry[isEntryFlag]);
}

export const NoteItem = (title, description) => {

  const note = noteFunctionality(title, description);

  const itemObject = {
    ...note,
    ...observerFunctionality(),
    getItemObject: () => {
      return {
        type: 'note',
        title: note.getTitle(),
        description: note.getDescription()
      };
    },
    updateSelf: (updates) => updateSelfFunctionality(itemObject, updates),
  }
  return itemObject;
}

export const TODOItem = (title, description, dueDate, priority) => {
  const note = noteFunctionality(title, description);
  const todo = todoFunctionality(dueDate, priority);
  const itemObject = {
    ...note,
    ...todo,
    ...observerFunctionality(),
    getItemObject: () => {
      return {
        type: 'todo',
        title: note.getTitle(),
        description: note.getDescription(),
        dueDate: todo.getDueDate(),
        priority: todo.getPriorityLevel(),
      }
    },
    updateSelf: (updates) => updateSelfFunctionality(itemObject, updates),
  }
  return itemObject;
}

export const ListItem = (title, description, entries) => {
  const note = noteFunctionality(title, description);
  const list = listFunctionality(entries);
  const itemObject = {
    ...note,
    ...list,
    ...observerFunctionality(),
    getItemObject: () => {
      return {
        type: 'list',
        title: note.getTitle(),
        description: note.getDescription(),
        entries: list.getListEntriesStorageObject(),
      }
    },
    updateSelf: (updates) => updateSelfFunctionality(itemObject, updates),
  }
  return itemObject;
}

export const TODOListItem = (title, description, dueDate, priority, entries) => {
  const note = noteFunctionality(title, description);
  const list = listFunctionality(entries);
  const todo = todoFunctionality(dueDate, priority);
  const itemObject = {
    ...note,
    ...list,
    ...todo,
    ...observerFunctionality(),
    getItemObject: () => {
      return {
        type: 'list',
        title: note.getTitle(),
        description: note.getDescription(),
        dueDate: todo.getDueDate(),
        priority: todo.getPriorityLevel(),
        entries: list.getListEntriesStorageObject(),
      }
    },
    updateSelf: (updates) => updateSelfFunctionality(itemObject, updates),
  }
  return itemObject;
}