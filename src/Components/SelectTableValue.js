const SelectTableValue = ({ setTableValue, tableValue }) => {
  return (
    <div
      style={{
        width: "100%",
        height: 40,
        marginTop: 20,
        marginLeft: "auto",
        marginRight: "auto",
        color: "black",
      }}
    >
      <select
        onChange={(e) => {
          const value = e.currentTarget.value;
          setTableValue(value);
        }}
        value={tableValue}
        style={{
          backgroundColor: "#F7941D",
          width: "100%",
          marginLeft: "auto",
          marginRight: "auto",
          borderRadius: 8,
          borderWidth: 2,
          borderColor: "white",
          height: 40,
          fontSize: "20px",
          fontWeight: "bold",
          textAlign: "center",
        }}
      >
        <option value={1}>{"Table 1"}</option>;
        <option value={2}>{"Table 2"}</option>;
        <option value={3}>{"Table 3"}</option>;
        <option value={4}>{"Table 4"}</option>;
        <option value={5}>{"Table 5"}</option>;
      </select>
    </div>
  );
};
export default SelectTableValue;
