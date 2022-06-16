import { TextField, MenuItem } from "@mui/material";

const FilterComponent = ({ filter, onFilter }) => {
  return (
    <div className="flex w-4/5 gap-4 justify-end mb-4">
      <TextField
        type="text"
        name="filterText"
        value={filter.filterText}
        onChange={onFilter}
        label="Search by name or class"
        fullWidth
        variant="filled"
        focused
        className="basis-2/5"
      />

      <TextField
        className="basis-2/5"
        select
        fullWidth
        label="Session Filter"
        name="filterSession"
        value={filter.filterSession}
        onChange={onFilter}
      >
        <MenuItem value="">
          <em>None</em>
        </MenuItem>
        <MenuItem value="April, 2019 - March, 2020">
          April, 2019 - March, 2020
        </MenuItem>
        <MenuItem value="April, 2020 - March, 2021">
          April, 2020 - March, 2021
        </MenuItem>
        <MenuItem value="April, 2021 - March, 2022">
          April, 2021 - March, 2022
        </MenuItem>
        <MenuItem value="April, 2022 - March, 2023">
          April, 2022 - March, 2023
        </MenuItem>
        <MenuItem value="April, 2023 - March, 2024">
          April, 2023 - March, 2024
        </MenuItem>
      </TextField>
    </div>
  );
};

export default FilterComponent;
