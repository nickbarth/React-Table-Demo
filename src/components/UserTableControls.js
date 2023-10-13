import { usePreference } from "../context/PreferenceContext";

const UserTableControls = ({ dispatch, columnOrder }) => {
  const { columnOrder: order, saveOrder, loadOrder } = usePreference();

  const handleLoadOrder = () => {
    dispatch({ type: "SET_COLUMN_ORDER", value: loadOrder() });
  };

  const handleSaveOrder = () => {
    saveOrder(columnOrder);
  };

  return (
    <div className="text-right">
      <button className="m-2" onClick={() => handleSaveOrder()}>
        Save Order
      </button>
      <button className="m-3" onClick={() => handleLoadOrder()}>
        Load Order
      </button>
    </div>
  );
};

export default UserTableControls;
