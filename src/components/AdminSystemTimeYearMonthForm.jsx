import * as React from "react";

function YearMonthForm({ fromMonth, toMonth, months, date, localeUtils, onChange }) {
	
	const years = [];
	for (let i = fromMonth.getFullYear(); i <= toMonth.getFullYear(); i += 1) {
		years.push(i);
	}

	const handleChange = function handleChange(e) {
		const { year, month } = e.target.form;
		onChange(new Date(year.value, month.value));
	};


	return (
		<form className="DayPicker-Caption">
			<div className="d-flex w-80">
				<select name="month" onChange={handleChange} value={date.getMonth()} className="form-control">
					{months.map((month, i) => (
						<option key={month} value={i}>{month}</option>
					))}
				</select>
				<select name="year" onChange={handleChange} value={date.getFullYear()} className="form-control w_100px">
					{years.map(year => (
						<option key={year} value={year}>{year}</option>
					))}
				</select>
			</div>
		</form>
	);
}

export default YearMonthForm;
