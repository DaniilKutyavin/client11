import React, { useState, useEffect } from 'react';
import {
    createuser,
    getAlluser,
    updateuser,
    deleteuser,
} from '../http/contactApi'; // Adjust the import according to your API location
import '../style/ProductBuyForm.css'; // Import the CSS file

const UserForm = () => {
    const [users, setUsers] = useState([]);
    const [newUser, setNewUser] = useState({ name: '', post: '', img: null }); // State for new user

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        const data = await getAlluser();
        setUsers(data);
    };

    const handleUserChange = (id, field, value) => {
        setUsers(users.map(user => 
            user.id === id ? { ...user, [field]: value } : user
        ));
    };

    const handleNewUserChange = (field, value) => {
        setNewUser(prevState => ({ ...prevState, [field]: value }));
    };

    const handleUserSubmit = async (user) => {
        const userFormData = new FormData();
        userFormData.append('name', user.name);
        userFormData.append('post', user.post);
        if (user.img) userFormData.append('img', user.img);

        if (user.id) {
            await updateuser(user.id, userFormData); // Update existing user
        } else {
            await createuser(userFormData); // Create new user
        }

        fetchUsers(); // Refresh the user list after submission
    };

    const handleDeleteUser = async (id) => {
        await deleteuser(id);
        fetchUsers(); // Refresh the user list
    };

    return (
        <div className="delivery-page"> {/* Match class name for the wrapper */}
            <h1>Добавить сотрудника</h1>
            <form className="delivery-form"> {/* Match class name for the form */}
                <label htmlFor="name">Имя:</label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    placeholder="Введите имя сотрудника"
                    value={newUser.name}
                    onChange={(e) => handleNewUserChange('name', e.target.value)}
                    required
                />
                
                <label htmlFor="post">Должность:</label>
                <input
                    type="text"
                    id="post"
                    name="post"
                    placeholder="Введите должность"
                    value={newUser.post}
                    onChange={(e) => handleNewUserChange('post', e.target.value)}
                    required
                />
                
                <label>Фото сотрудника:</label>
                <input
                    type="file"
                    onChange={(e) => handleNewUserChange('img', e.target.files[0])} // Handle image upload
                />
                
                <button type="button" className="productBuyForm_submitButton" onClick={() => handleUserSubmit(newUser)}>
                    Добавить сотрудника
                </button>
            </form>

            <h2>Список сотрудников</h2>
            <ul className="productBuyForm_productList">
                {users
                    .sort((a, b) => a.id - b.id) // Sort users by ID in ascending order
                    .map(user => (
                    <li key={user.id} className="productBuyForm_productItem">
                        <input
                            type="text"
                            value={user.name}
                            onChange={(e) => handleUserChange(user.id, 'name', e.target.value)}
                            placeholder="Имя"
                        />
                        <input
                            type="text"
                            value={user.post}
                            onChange={(e) => handleUserChange(user.id, 'post', e.target.value)}
                            placeholder="Должность"
                        />
                        <input
                            type="file"
                            onChange={(e) => handleUserChange(user.id, 'img', e.target.files[0])} // Handle image upload
                        />
                        <button onClick={() => handleUserSubmit(user)} className="productBuyForm_submitButton">
                            Сохранить
                        </button>
                        <button onClick={() => handleDeleteUser(user.id)} className="productBuyForm_deleteButton">
                            Удалить
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default UserForm;
