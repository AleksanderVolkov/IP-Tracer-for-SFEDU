//SlideItem.jsx
import "./slideItem.scss";

// Ячейка таблицы
export default function SlideItem({ name, value, color }) {
	return (
		<li className="table-line">
			<p className="table-text">{name}:</p>
			<b className="table-text" id={color}>{value}</b>
		</li>
	);
}
