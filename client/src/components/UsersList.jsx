import React, { useEffect, useContext } from "react";
import { observer } from "mobx-react-lite";
import { Row } from "react-bootstrap";
import { Context } from "..";
import UserItem from "./UserItem";

const UsersList = observer(() => {
    const { user } = useContext(Context);

    useEffect(() => {
        user.fetchUsers(); // Загружаем пользователей при монтировании
    }, [user]);

    console.log("user.users:", user.users);

    return (
        <Row className="d-flex mt-2">
            <h2>Пользователи</h2>
            {Array.isArray(user.users) && user.users.length > 0 ? (
                user.users.map((u) => <UserItem key={u.id} user={u} />)
            ) : (
                <p>Нет пользователей.</p>
            )}
        </Row>
    );
});

export default UsersList;
