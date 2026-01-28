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
    title = newTitle;
  }

  const setDescription = (newDescription) => {
    description = newDescription;
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
    let formattedDate = ''
    try {
      formattedDate = format(dueDate, "MMM do, hh:mmaaa");
    } catch {
      formattedDate = 'could not fetch date';
    }
    return formattedDate
  }

  const getTimeToDueDate = () => {
    let formattedDate = ''
    try {
      formattedDate = formatDistance(dueDate, new Date(), {addSuffix: true});
    } catch {
      formattedDate = 'could not fetch time span';
    }
    return formattedDate;
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
  
  const tickEntry = (entry) => {
    entry.checked = !entry.checked;
  }
  
  return {
    getAllEntries,
    addEntry,
    removeEntry,
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

export const NoteItem = (title = null, description = null) => {

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

export const TODOItem = (title = null, description = null, dueDate = (new Date()).getTime(), priority = null) => {
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

export const ListItem = (title = null, description = null, entries = []) => {
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

export const TODOListItem = (title = null, description = null, dueDate = (new Date()).getTime(), priority = null, entries = []) => {
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