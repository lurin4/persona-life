export default function PersonaSelect({ id, value, options, onChange }) {
  return (
    <select
      id={id}
      className="persona-select"
      value={value}
      onChange={(event) => onChange(event.target.value)}
    >
      {options.map((option) => (
        <option key={option} value={option}>
          {option.toString().toUpperCase()}
        </option>
      ))}
    </select>
  );
}
