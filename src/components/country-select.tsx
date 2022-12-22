import React from "react";

import { countries } from "react-circle-flags";

type CountrySelectProps = React.SelectHTMLAttributes<HTMLSelectElement>;

const CountrySelect = React.forwardRef<HTMLSelectElement, CountrySelectProps>(({ ...selectProps }, ref) => {
    return (
        <select className="border border-gray-300 p-2 overflow-hidden w-20" ref={ref} {...selectProps}>
            {
                Object.keys(countries).map((country) => (
                    <option key={country} value={country}>
                        {country.toLocaleUpperCase()}
                    </option>
                ))
            }
        </select >
    );
});

export default CountrySelect;