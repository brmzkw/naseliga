import React from "react";

import { countries } from "react-circle-flags";

type CountrySelectProps = React.SelectHTMLAttributes<HTMLSelectElement>;

const CountrySelect = React.forwardRef<HTMLSelectElement, CountrySelectProps>(
  ({ ...selectProps }, ref) => {
    return (
      <select
        className="w-20 overflow-hidden border border-gray-300 p-2"
        ref={ref}
        {...selectProps}
      >
        {Object.keys(countries).map((country) => (
          <option key={country} value={country}>
            {country.toLocaleUpperCase()}
          </option>
        ))}
      </select>
    );
  }
);

CountrySelect.displayName = "CountrySelect";

export default CountrySelect;
