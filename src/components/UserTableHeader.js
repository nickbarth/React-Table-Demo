const UserTableHeader = ({
  dispatch,
  columns,
  columnOrder,
  isAuthenticated,
  sortedBy,
  sortAscending,
  handleSort,
}) => {
  // Event Handlers
  const onDragStart = (e, id) => {
    e.target.classList.add("dragging");
    e.dataTransfer.setData("columnId", id);
    e.dataTransfer.effectAllowed = "move";
  };

  const onDragEnd = (e) => {
    e.target.classList.remove("dragging");
  };

  const onDrop = (e, id) => {
    e.preventDefault();

    const draggedId = e.dataTransfer.getData("columnId");
    const newOrder = [...columnOrder];

    const draggedIndex = newOrder.indexOf(draggedId);
    const dropIndex = newOrder.indexOf(id);

    newOrder.splice(draggedIndex, 1);
    newOrder.splice(dropIndex, 0, draggedId);

    dispatch({ type: "SET_COLUMN_ORDER", value: newOrder });
  };

  const allowDrop = (e) => {
    e.preventDefault();
  };

  return (
    <thead style={{ position: "sticky", top: 0, background: "#eee" }}>
      <tr>
        {columnOrder.map((column) => (
          <th
            key={column}
            onClick={() => handleSort(column)}
            className={isAuthenticated ? "draggable" : ""}
            draggable={isAuthenticated}
            onDragStart={isAuthenticated ? (e) => onDragStart(e, column) : null}
            onDrop={isAuthenticated ? (e) => onDrop(e, column) : null}
            onDragOver={isAuthenticated ? allowDrop : null}
            onDragEnd={isAuthenticated ? onDragEnd : null}
          >
            {columns.find((c) => c.id === column).label}{" "}
            {sortedBy === column && (sortAscending ? "▲" : "▼")}
          </th>
        ))}
      </tr>
    </thead>
  );
};

export default UserTableHeader;
