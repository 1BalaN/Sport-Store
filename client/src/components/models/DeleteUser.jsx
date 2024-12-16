import React, { useState } from "react";
import { Modal, Button, Alert } from "react-bootstrap";
import PropTypes from "prop-types";

const DeleteUser = ({ show, onHide, onDelete, userId, userName, userRole }) => {
    const [isDeleting, setIsDeleting] = useState(false);
    const [deleteError, setDeleteError] = useState(null);

    const handleDelete = async () => {
        setIsDeleting(true);
        setDeleteError(null);
    
        try {
            await onDelete(userId); // Удаление пользователя
            onHide(); // Закрытие окна после успешного удаления
        } catch (error) {
            console.error("Ошибка при удалении пользователя:", error);
            setDeleteError("Произошла ошибка при удалении пользователя.");
        } finally {
            setIsDeleting(false);
        }
    };
    

    const isAdmin = userRole === "ADMIN";

    return (
        <Modal show={show} onHide={onHide} size="md" centered>
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Удаление пользователя
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {isAdmin ? (
                    <Alert variant="danger">
                        Невозможно удалить пользователя с ролью администратора.
                    </Alert>
                ) : (
                    <>
                        <p>
                            Вы уверены, что хотите удалить пользователя: <strong>{userName}</strong>?
                        </p>
                        {deleteError && (
                            <Alert variant="danger">
                                {deleteError}
                            </Alert>
                        )}
                    </>
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="outline-warning" onClick={onHide} disabled={isDeleting}>
                    Отмена
                </Button>
                <Button
                    variant="outline-danger"
                    onClick={handleDelete}
                    disabled={isDeleting || isAdmin}
                >
                    {isDeleting ? "Удаление..." : "Удалить"}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

DeleteUser.propTypes = {
    show: PropTypes.bool.isRequired,
    onHide: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
    userId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    userName: PropTypes.string.isRequired,
    userRole: PropTypes.string.isRequired,
};

export default DeleteUser;
