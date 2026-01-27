import { format } from 'date-fns';

const priorityOptions = ['important', 'casual', 'unimportant'];
const keysToLabels = {
  'title': 'Name',
  'description': 'Description',
  'dueDate': 'Deadline',
  'priority': 'Priority',
}

export default function(item) {
  const itemStorageObject = item.getItemObject();
  const itemDialog = document.createElement('dialog');
  itemDialog.id = 'item-dialog';

  const closeButton = document.createElement('button');
  closeButton.type = 'button';
  closeButton.setAttribute('aria-label', 'close modal');
  closeButton.addEventListener('click', () => {
    itemDialog.close();
  })
  itemDialog.appendChild(closeButton);

  const modalHeader = document.createElement('h2');
  modalHeader.textContent = itemStorageObject['type'];
  itemDialog.appendChild(modalHeader);

  const dialogForm = document.createElement('form');
  dialogForm.setAttribute('method', 'dialog');
  for (let fieldKey of Object.keys(itemStorageObject).slice(1)) {
    const field = document.createElement('p');
    field.setAttribute('data-field-type', fieldKey);
    if (fieldKey === 'dueDate') {
      const fieldLabel = document.createElement('label');
      fieldLabel.textContent = keysToLabels[fieldKey];
      fieldLabel.setAttribute('data-storage-key', fieldKey);
      fieldLabel.setAttribute('for', `field-input-${fieldKey}`);
      const fieldInput = document.createElement('input');
      fieldInput.type = 'datetime-local';
      const formattedDueDate = format(item.getDueDate(), "yyyy-MM-dd'T'HH:mm");
      const formattedCurrentTime = format(new Date(), "yyyy-MM-dd'T'HH:mm");
      fieldInput.min = formattedCurrentTime;
      fieldInput.value = formattedDueDate;
      fieldInput.id = `field-input-${fieldKey}`;
      field.appendChild(fieldLabel);
      field.appendChild(fieldInput);
    } else if (fieldKey === 'priority') {
      const fieldLabel = document.createElement('label');
      fieldLabel.textContent = keysToLabels[fieldKey];
      fieldLabel.setAttribute('data-storage-key', fieldKey);
      fieldLabel.setAttribute('for', `field-input-${fieldKey}`);
      const fieldInput = document.createElement('select');
      for (let priorityLevel of priorityOptions) {
        const newPriorityOption = document.createElement('option');
        newPriorityOption.value = priorityLevel;
        newPriorityOption.textContent = priorityLevel;
        fieldInput.appendChild(newPriorityOption);
      fieldInput.id = `field-input-${fieldKey}`;
      field.appendChild(fieldLabel);
      field.appendChild(fieldInput);
      }
    } else if (fieldKey === 'entries') {
      for (let i = 0; i < itemStorageObject.entries.length; i++) {
        const entryContainer = document.createElement('div');
        entryContainer.classList.add('entry-container');
        const entryLabel = document.createElement('label');
        entryLabel.for = `entry-${i}`;
        entryLabel.textContent = itemStorageObject.entries[i].contents;
        const entryCheckbox = document.createElement('input');
        entryCheckbox.type = 'checkbox';
        entryCheckbox.id = `entry-${i}`;
        entryContainer.appendChild(entryCheckbox);
        entryContainer.appendChild(entryLabel)
        field.appendChild(entryContainer);
      }
    } else {
      const fieldLabel = document.createElement('label');
      fieldLabel.textContent = keysToLabels[fieldKey];
      fieldLabel.setAttribute('data-storage-key', fieldKey);
      fieldLabel.setAttribute('for', `field-input-${fieldKey}`);
      const fieldInput = document.createElement('input');
      fieldInput.value = itemStorageObject[fieldKey];
      fieldInput.type = 'text';
      fieldInput.id = `field-input-${fieldKey}`;
      field.appendChild(fieldLabel);
      field.appendChild(fieldInput);
    }
    dialogForm.appendChild(field);
  }
  const submitButton = document.createElement('button');
  submitButton.textContent = 'Save changes';
  submitButton.addEventListener('click', (event) => {
    event.preventDefault();
    const updatedValues = {};
    for (let field of itemDialog.getElementsByTagName('p')) {
      let fieldKey = '';
      let fieldValue = '';
      if (field.getAttribute('data-field-type') === 'entries') {
       fieldKey = 'entries';
        fieldValue = [];
        for (let entry of field.getElementsByClassName('entry-container')) {
          const entryContents = entry.getElementsByTagName('label')[0].textContent;
          const entryState = entry.getElementsByTagName('input')[0].checked;
          fieldValue.unshift({ contents: entryContents, state: entryState });
        }
      } else if (field.getAttribute('data-field-type') === 'priority') {
        fieldKey = field.getElementsByTagName('label')[0].getAttribute('data-storage-key');
        fieldValue = field.getElementsByTagName('select')[0].value;
      } else {
        fieldKey = field.getElementsByTagName('label')[0].getAttribute('data-storage-key');
        fieldValue = field.getElementsByTagName('input')[0].value;
      }
      updatedValues[fieldKey] = fieldValue;
    }
    itemDialog.close(JSON.stringify(updatedValues));
  })
  dialogForm.appendChild(submitButton);

  const deleteButton = document.createElement('button');
  deleteButton.textContent = 'Delete';
  deleteButton.type = 'button';
  dialogForm.appendChild(deleteButton);
  itemDialog.appendChild(dialogForm);

  itemDialog.addEventListener(
    'close',
    () => {
      const submittedValue = JSON.parse(itemDialog.returnValue);
      item.updateSelf(submittedValue);
    }
  )

  return itemDialog;
}