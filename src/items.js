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

  const getDueDate = () => dueDate;

  const getDueDateReadable = () => {
    return format(dueDate, "MMM do, hh:mmaaa");
  }

  const getTimeToDueDate = () => {
    return formatDistance(dueDate, new Date(), {addSuffix: true});
  }

  const getPriorityLevel = () => priorityLevel;

  const setDueDate = (newDueDate) => {
    if (validateDate(newDueDate)) {
      dueDate = newDueDate;
      return true;
    }
    return false;
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

  const validateDate = (newDueDate) => {
    if (newDueDate && Object.prototype.toString.call(newDueDate) === '[object Date]' && !isNaN(date)) {
      return (checkDateInPast(newDueDate)) ? false : true;
    }
    return false;
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

const getListEntriesStorageObject = (entries) => {
  const convertedEntries = [];
  entries.forEach((entry) => {
    convertedEntries.unshift({contents: entry.contents, checked: entry.checked})
  });
  return convertedEntries;
}

export const NoteItem = (title, description) => {
  const itemObject = {
    getItemObject: () => {
      return {type: 'note', title, description};
    },
    ...noteFunctionality(title, description),
    updateSelf: (updates) => updateSelfFunctionality(itemObject, updates),
  }
  return itemObject;
}

export const TODOItem = (title, description, dueDate, priority) => {
  const itemObject = {
    getItemObject: () => {
      return {type: 'todo', title, description, dueDate, priority}
    },
    ...noteFunctionality(title, description),
    ...todoFunctionality(dueDate, priority),
    updateSelf: (updates) => updateSelfFunctionality(itemObject, updates),
  }
  return itemObject;
}

export const ListItem = (title, description, entries) => {
  const itemObject = {
    getItemObject: () => {
      return {type: 'list', title, description, entries: getListEntriesStorageObject(entries)}
    },
    ...noteFunctionality(title, description),
    ...listFunctionality(entries),
    updateSelf: (updates) => updateSelfFunctionality(itemObject, updates),
  }
  return itemObject;
}

export const TODOListItem = (title, description, dueDate, priority, entries) => {
  const itemObject = {
    getItemObject: () => {
      return {type: 'todolist', title, description, dueDate, priority, entries: getListEntriesStorageObject(entries)}
    },
    ...noteFunctionality(title, description),
    ...todoFunctionality(dueDate, priority),
    ...listFunctionality(entries),
    updateSelf: (updates) => updateSelfFunctionality(itemObject, updates),
  }
  return itemObject;
}