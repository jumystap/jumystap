import React, { useState } from 'react';
import Modal from 'react-modal';
import { useForm } from '@inertiajs/react';

Modal.setAppElement('#app');

const CreatePortfolioModal = ({ isOpen, onRequestClose }) => {
    const [image, setImage] = useState(null);
    const { post } = useForm();

    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('image', image);

        try {
            await axios.post('/portfolio', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            onRequestClose();
            window.location.reload()
        } catch (error) {
            console.error('Error uploading image:', error);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            contentLabel="Create Portfolio Modal"
            className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50"
            overlayClassName="fixed inset-0"
        >
            <div className="bg-white p-6 rounded-lg shadow-lg w-[400px]">
                <h2 className="text-lg font-bold mb-4">Добавить Портфолио</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            required
                        />
                    </div>
                    <div className="flex justify-end">
                        <button
                            type="submit"
                            className="bg-orange-500 text-white py-2 px-4 rounded-lg"
                        >
                            Сохранить
                        </button>
                        <button
                            type="button"
                            onClick={onRequestClose}
                            className="ml-4 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg"
                        >
                            Отмена
                        </button>
                    </div>
                </form>
            </div>
        </Modal>
    );
};

export default CreatePortfolioModal;
