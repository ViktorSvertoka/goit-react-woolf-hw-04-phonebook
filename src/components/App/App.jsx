import { useState, useEffect } from 'react';
import { nanoid } from 'nanoid';
import { BiSolidContact } from 'react-icons/bi';

import ContactForm from '../ContactForm/ContactForm';
import ContactList from '../ContactList/ContactList';
import Filter from '../Filter/Filter';

const phoneContacts = [
  { id: 'id-1', name: 'Steve Jobs', number: '459-12-56' },
  { id: 'id-2', name: 'Bill Gates', number: '443-89-12' },
  { id: 'id-3', name: 'Jeff Bezos', number: '645-17-79' },
  { id: 'id-4', name: 'Elon Musk', number: '227-91-26' },
];

const App = () => {
  // Значення витягується з локального сховища браузера з ключем 'contacts'
  const [contacts, setContacts] = useState(() => {
    return JSON.parse(window.localStorage.getItem('contacts')) ?? phoneContacts; // Якщо значення не знайдено, встановлюється значення масиву phoneContacts.
  });

  const [filter, setFilter] = useState('');

  // Спрацьовує при зміні стану contacts. Зберігає поточні контакти у локальному сховищі браузера з ключем 'contacts'.
  useEffect(() => {
    window.localStorage.setItem('contacts', JSON.stringify(contacts));
  }, [contacts]);

  // Додає новий контакт до списку контактів.
  const addContact = contact => {
    const isInContacts = contacts.some(
      ({ name }) =>
        name.toLowerCase().trim() === contact.name.toLowerCase().trim()
    );
    // Перевіряє, чи є контакт із таким же ім'ям у списку контактів. Якщо контакт вже існує, виводиться попередження.
    if (isInContacts) {
      alert(`${contact.name} is already in contacts`);
      return;
    }

    setContacts(prevContacts => [
      ...prevContacts,
      { id: nanoid(), ...contact },
    ]);
  };

  // Змінює значення фільтра.
  const changeFilter = event => {
    setFilter(event.target.value.trim());
  };

  // Отримання відфільтрованих контактів.
  const getVisibleContacts = () => {
    const normalizedFilter = filter.toLowerCase();

    return contacts.filter(contact =>
      contact.name.toLowerCase().includes(normalizedFilter)
    );
  };

  // Видалення контакту зі списку.
  const removeContact = contactId => {
    setContacts(prevContacts =>
      prevContacts.filter(contact => contact.id !== contactId)
    );
  };

  const visibleContacts = getVisibleContacts();

  return (
    <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <BiSolidContact className="mx-auto" size="75" color="#4f46e5" />
        <h1 className="mt-10 text-center text-3xl font-bold leading-9 tracking-tight text-gray-900">
          Phonebook
        </h1>
      </div>
      <ContactForm onSubmit={addContact} />
      {contacts.length > 0 ? (
        <>
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Contacts
          </h2>
          {/* Фільтр для відображення контактів */}
          <Filter value={filter} onChangeFilter={changeFilter} />
        </>
      ) : (
        <p className="mt-10 text-center text-1xl font-bold leading-9 tracking-tight text-gray-600">
          Your phonebook is empty. Add first contact!
        </p>
      )}
      {contacts.length > 0 && (
        // Список контактів
        <ContactList
          contacts={visibleContacts}
          onRemoveContact={removeContact}
        />
      )}
    </div>
  );
};

export default App;
