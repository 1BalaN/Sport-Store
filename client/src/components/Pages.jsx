import { observer } from "mobx-react-lite";
import React, { useContext } from "react";
import { Pagination } from "react-bootstrap";
import { Context } from "..";

const Pages = observer(() => {
  const {item} = useContext(Context)
    const pageCount = Math.ceil(item.totalCount / item.limit)
    const pages = []

    for(let i = 0; i < pageCount; i++ ) {
        pages.push(i + 1)
    }

    return (
        <Pagination className="mt-5">
            {pages.map(page => 
                <Pagination.Item
                    key={page}
                    active={item.page === page}
                    onClick={() => item.setPage(page)}
                >
                    {page}
                </Pagination.Item>
            )}
        </Pagination>
    )
});

export default Pages;
