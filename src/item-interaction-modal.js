import { format } from 'date-fns';

const priorityOptions = ['important', 'casual', 'unimportant'];

export default function(item) {
  const itemDialog = document.createElement('dialog');
  itemDialog.id = 'item-dialog';

  const dialogForm = document.createElement('form');
  const itemStorageObject = item.getStorageObject();
  for (let fieldKey of itemStorageObject) {
    const field = document.createElement('p');
    if (fieldKey === 'dueDate') {
      const fieldLabel = document.createElement('label');
      fieldLabel.textContent = fieldKey;
      fieldLabel.for = `field-input-${fieldKey}`;
      const fieldInput = document.createElement('datetime-local');
      const formattedDueDate = format(item.getDueDate(), "yyyy-MM-dd-'24T'HH:mm");
      const formattedCurrentTime = format(new Date(), "yyyy-MM-dd-'24T'HH:mm");
      fieldInput.value = formattedDueDate;
      fieldInput.min = formattedCurrentTime;
      fieldInput.id = `field-input-${fieldKey}`;
      field.appendChild(fieldLabel);
      field.appendChild(fieldInput);
    } else if (fieldKey === 'priority') {
      const fieldLabel = document.createElement('label');
      fieldLabel.textContent = fieldKey;
      fieldLabel.for = `field-input-${fieldKey}`;
      const fieldInput = document.createElement('select');
      for (let priorityLevel of priorityOptions) {
        const newPriorityOption = document.createElement('option');
        newPriorityOption.value = priorityLevel;
        fieldInput.appendChild(newPriorityOption);
      fieldInput.id = `field-input-${fieldKey}`;
      field.appendChild(fieldLabel);
      field.appendChild(fieldInput);
      }
    } else if (fieldKey === 'entries') {
      for (let i = 0; i < itemStorageObject.entries.length; i++) {
        const entryLabel = document.createElement('label');
        entryLabel.for = `entry-${i}`;
        entryLabel.textContent = itemStorageObject.entries[i].contents;
        const entryCheckbox = document.createElement('input');
        entryCheckbox.type = 'checkbox';
        entryCheckbox.id = `entry-${i}`;
        field.appendChild(entryCheckbox);
        field.appendChild(entryLabel);
      }
    } else {
      const fieldLabel = document.createElement('label');
      fieldLabel.textContent = fieldKey;
      fieldLabel.for = `field-input-${fieldKey}`;
      const fieldInput = document.createElement('input');
      fieldInput.value = itemStorageObject[fieldKey];
      fieldInput.type = 'text';
      fieldInput.id = `field-input-${fieldKey}`;
      field.appendChild(fieldLabel);
      field.appendChild(fieldInput);
    }
    dialogForm.appendChild(field);
  }
  const submitButton = document.createElement('Button');
  submitButton.textContent = 'Save changes';
  dialogForm.appendChild(submitButton);
  itemDialog.appendChild(dialogForm);
}