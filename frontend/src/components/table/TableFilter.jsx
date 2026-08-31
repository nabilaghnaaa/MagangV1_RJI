import Select from "../common/Select";

const TableFilter = ({
  value,
  onChange,
  options = [],
  label = "Status",
}) => {
  return (
    <div className="w-full sm:w-44">
      <Select
        name="status"
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        options={options}
        placeholder={label}
      />
    </div>
  );
};

export default TableFilter;