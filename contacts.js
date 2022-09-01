const path = require('node:path');
const fs = require('node:fs/promises');
const { randomUUID } = require('node:crypto');

const contactsPath = path.join(__dirname, './db/contacts.json');

const reset = '\x1b[0m';
const bright = '\x1b[1m';

const red = '\x1b[31m';
const green = '\x1b[32m';
const yellow = '\x1b[33m';

const BGblue = '\x1b[44m';

/**
 * @async
 * @returns {Array} Array of contacts from contacts.json.
 */
async function readContacts() {
  try {
    const content = await fs.readFile(contactsPath, { encoding: 'utf8' });
    return JSON.parse(content);
  } catch (e) {
    console.error('Read error:', e.message);
  }
}

/**
 * @async
 * @param {Array} dataToWrite New array of contacts for write to contacts.json.
 */
async function writeContacts(dataToWrite) {
  try {
    const plainText = JSON.stringify(dataToWrite);
    await fs.writeFile(contactsPath, plainText);
  } catch (e) {
    console.error('Write error:', e.message);
  }
}

/**
 * @async
 * @description Log list of contacts.
 */
async function listContacts() {
  try {
    const contacts = await readContacts();

    if (!contacts) {
      throw new Error('No data to display.');
    }

    if (contacts.length === 0) {
      console.log(`${yellow} Empty contacts list.${reset}`);
      return;
    }

    console.log(`${bright}${green}List of contacts:${reset}${BGblue}`);
    console.table(contacts, ['name', 'email', 'phone']);
    console.log(reset);
  } catch (e) {
    console.error('Log list error:', e.message);
  }
}

/**
 * @async
 * @param {String} contactId Contact's id.
 * @description Log contact by his ID.
 */
async function getContactById(contactId) {
  try {
    const contacts = await readContacts();
    const contact = contacts.find(({ id }) => id === contactId);

    if (!contact) {
      console.log(`${red}Contact with id ${contactId} not exist!${reset}`);
      return;
    }

    console.log(
      `${bright}${green}Contact by id ${contactId}:${reset}${BGblue}`
    );
    console.table(contact);
    console.log(reset);
  } catch (e) {
    console.error('Log contact by ID error:', e.message);
  }
}

/**
 * @async
 * @param {string} contactId Contact's id.
 * @description Remove contact by id from contacts.json.
 */
async function removeContact(contactId) {
  try {
    const contacts = await readContacts();
    const filteredContacts = contacts.filter(({ id }) => id !== contactId);

    if (filteredContacts.length === contacts.length) {
      console.log(`${red} Contact with id ${contactId} not exist!${reset}`);
      return;
    }

    await writeContacts(filteredContacts);

    console.log(
      `${bright}${green}Contact with id ${contactId} has been deleted.${reset}`
    );
  } catch (e) {
    console.error('Delete contact by ID error:', e.message);
  }
}

/**
 * @async
 * @param {string} name Contact full name.
 * @param {string} email Contact email.
 * @param {string} phone Contact phone number.
 * @description Add contact to contacts.json.
 */
async function addContact(name, email, phone) {
  try {
    const newContact = {
      id: randomUUID(),
      name,
      email,
      phone,
    };
    const contacts = await readContacts();

    contacts.push(newContact);

    await writeContacts(contacts);

    console.log(`${bright}${green}Contact has been added.${reset}${BGblue}`);
    console.table(newContact);
    console.log(reset);
  } catch (e) {
    console.error('Unable to add contact. Error:', e.message);
  }
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
};
