import React, { useState, useEffect } from 'react';
import { createinfo, getAllinfo, updateinfo, deleteinfo } from '../http/contactApi';
import '../style/ProductBuyForm.css'; // Import the same CSS file for consistent styling

const ContactForm = () => {
    const [contacts, setContacts] = useState([]);
    const [currentContact, setCurrentContact] = useState({ name: '', adress: '', telephone: '', email: '', id: null });
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        fetchContacts();
    }, []);

    const fetchContacts = async () => {
        const data = await getAllinfo();
        setContacts(data);
    };

    const handleContactSubmit = async (e) => {
        e.preventDefault();
        const formData = {
            id: currentContact.id,
            name: e.target.name.value,
            adress: e.target.adress.value,
            telephone: e.target.telephone.value,
            email: e.target.email.value,
        };

        if (currentContact.id) {
            await updateinfo(formData.id, formData);
        } else {
            await createinfo(formData);
        }

        resetForm();
        fetchContacts();
    };

    const handleEditContact = (contact) => {
        setCurrentContact(contact);
        setIsEditing(true);
    };

    const handleDeleteContact = async (id) => {
        await deleteinfo(id);
        fetchContacts();
    };

    const resetForm = () => {
        setCurrentContact({ name: '', adress: '', telephone: '', email: '', id: null });
        setIsEditing(false);
    };

    return (
        <div className="delivery-page">
            <h1>{isEditing ? 'Редактировать контакт' : 'Добавить контакт'}</h1>
            <form className="delivery-form" onSubmit={handleContactSubmit}>
                <label htmlFor="name">Имя:</label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    value={currentContact.name}
                    onChange={(e) => setCurrentContact({ ...currentContact, name: e.target.value })}
                    required
                />
                
                <label htmlFor="adress">Адрес:</label>
                <input
                    type="text"
                    id="adress"
                    name="adress"
                    value={currentContact.adress}
                    onChange={(e) => setCurrentContact({ ...currentContact, adress: e.target.value })}
                    required
                />
                
                <label htmlFor="telephone">Телефон:</label>
                <input
                    type="tel"
                    id="telephone"
                    name="telephone"
                    value={currentContact.telephone}
                    onChange={(e) => setCurrentContact({ ...currentContact, telephone: e.target.value })}
                    required
                />
                
                <label htmlFor="email">Email:</label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    value={currentContact.email}
                    onChange={(e) => setCurrentContact({ ...currentContact, email: e.target.value })}
                    required
                />
                
                <button type="submit" className="productBuyForm_submitButton">
                    {isEditing ? 'Обновить' : 'Добавить контакт'}
                </button>
                {isEditing && <button type="button" className="productBuyForm_submitButton" onClick={resetForm}>Отмена</button>}
            </form>

            <h2>Список контактов</h2>
            <ul className="productBuyForm_productList">
                {contacts.map(contact => (
                    <li key={contact.id} className="productBuyForm_productItem">
                        {contact.name} - {contact.adress} - {contact.telephone} - {contact.email}
                        <button onClick={() => handleEditContact(contact)} className="productBuyForm_submitButton">Редактировать</button>
                        <button onClick={() => handleDeleteContact(contact.id)} className="productBuyForm_deleteButton">Удалить</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ContactForm;
