const BoardItem = (title, description) => {

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

  const getPriorityLevel = () => priorityLevel;

  const setDueDate = (newDueDate) => {
    if (validateDate(newDueDate)) {
      dueDate = newDueDate;
      return true;
    }
    return false;
  }

  const setPriorityLevel = (userPriorityLevels, newPriorityLevel) => {
    if (validatePriorityLevel(userPriorityLevels, newPriorityLevel)) {
      priorityLevel = newPriority;
      return true;
    }
    return false;
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

  const validatePriorityLevel = (prioritiesList, newPriority) => {
    return (prioritiesList.contains(newPriority)) ? true: false;
  }

  const getDeadlineProximity = () => {
    if (checkDateInPast(dueDate)) 'expired';
    const urgentTimeSpan = 24 * 60 * 60 * 1000; // number of ms in one day
    if (timeDiff < urgentTimeSpan) {
      return 'close';
    } else {
      return 'fine';
    }
  }

  return {
    getDueDate,
    getPriorityLevel,
    setDueDate,
    setPriorityLevel,
    getDeadlineProximity,
  }
}


const listFunctionality = (entries) => {
  
  const getAllEntries = () => entries;
  
  const addEntry = (newEntry) => {
    if (validateListEntry) {
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
  
  const getEntryCheckedState = (entry) => {
    return !!(entry.checked);
  }
  
  const tickEntry = (entry) => {
    entry.checked = !entry.checked;
  }
  
  const validateListEntry = (listEntry) => {
    if (checkListEntry(listEntry)) {
      return true;
    }
    return false;
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

export const listEntry = (contents) => {
  return {
    contents,
    checked: false,
    [isEntryFlag]: true,
  }
}

function checkListEntry(listEntry) {
  return !!(listEntry && listEntry[isEntryFlag]);
}

export const TODOItem = (title, description, dueDate, priority) => {
  return {
    getStorageObj: () => {
      return {title, description, dueDate, priority}
    },
    ...BoardItem(title, description),
    ...todoFunctionality(dueDate, priority),
  }
}

export const ListItem = (title, description, entries) => {
  return {
    getStorageObj: () => {
      return {title, description, entries}
    },
    ...BoardItem(title, description),
    ...listFunctionality(entries),
  }
}

export const TODOListItem = (title, description, dueDate, priority, entries) => {
  return {
    getStorageObj: () => {
      return {title, description, dueDate, priority, entries}
    },
    ...BoardItem(title, description),
    ...todoFunctionality(dueDate, priority),
    ...listFunctionality(entries),
  }
}