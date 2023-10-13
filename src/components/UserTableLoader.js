const UserTableLoader = ({ colSpan }) => (
  <tr>
    <td colSpan={colSpan} style={{ textAlign: "center" }}>
      <img
        src="https://upload.wikimedia.org/wikipedia/commons/d/de/Ajax-loader.gif"
        alt="Loading..."
      />{" "}
      <span>Loading...</span>
    </td>
  </tr>
);

export default UserTableLoader;
