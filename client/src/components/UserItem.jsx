import React, { useState, useContext } from "react";
import { Button, Row, Col, Alert, Card } from "react-bootstrap";
import { Context } from "..";
import { deleteUser, getUsers } from "../http/userApi";
import DeleteUser from "../components/models/DeleteUser";

const UserItem = ({ user }) => {
    const { user: userStore } = useContext(Context);
    const [visibleDeleteUser, setVisibleDeleteUser] = useState(false);
    const [showErrorAlert, setShowErrorAlert] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const removeUser = async (id) => {
        if (user.role === "ADMIN") {
            setErrorMessage("Вы не можете удалить администратора.");
            setShowErrorAlert(true);
            return;
        }
    
        try {
            // Удаляем пользователя
            await deleteUser(id);
    
            // Обновляем локальный список пользователей после удаления
            const updatedUsers = await getUsers(); // Получаем актуальные данные с сервера
            userStore.setUsers(updatedUsers);
    
            setVisibleDeleteUser(false); // Закрываем модальное окно
        } catch (error) {
            console.error("Ошибка при удалении пользователя:", error);
            setErrorMessage("Произошла ошибка при удалении пользователя.");
            setShowErrorAlert(true);
        }
    };
    

    return (
        <>
            <Card className="mb-4 shadow-sm border-0">
                <Card.Body className="p-4">
                    <Row className="align-items-center">
                        <Col md={6}>
                            <h5 style={{color:"#FF4500"}} className="mb-3" >Пользователь</h5>
                            <p>
                                <strong>Email:</strong> <span className="text-muted">{user.email}</span>
                            </p>
                            <p>
                                <strong>Роль:</strong> <span className="text-muted">{user.role}</span>
                            </p>
                            <p>
                                <strong>Телефон:</strong>{" "}
                                <span className="text-muted">{user.phone || "Не указан"}</span>
                            </p>
                        </Col>
                        <Col md={6} className="text-md-right">
                            <Button
                                onClick={() => setVisibleDeleteUser(true)}
                                variant="outline-danger"
                                className="m-1"
                            >
                                Удалить
                            </Button>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>

            <DeleteUser
                show={visibleDeleteUser}
                userId={user.id}
                userName={user.email}
                userRole={user.role}
                onDelete={() => removeUser(user.id)}
                onHide={() => setVisibleDeleteUser(false)}
            />

            {showErrorAlert && (
                <Alert
                    variant="danger"
                    className="shadow-sm"
                    onClose={() => setShowErrorAlert(false)}
                    dismissible
                >
                    <Alert.Heading className="text-danger">Ошибка!</Alert.Heading>
                    <p className="mb-0">{errorMessage}</p>
                </Alert>
            )}
        </>
    );
};

export default UserItem;
