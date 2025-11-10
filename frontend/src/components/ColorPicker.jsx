import { Check } from "lucide-react";
import styles from "../styles/ColorPicker.module.css";

const ColorPicker = ({ value, onChange, colors }) => {
  return (
    <div>
      {colors.map((color) => (
        <button
          key={color}
          type="button"
          className={styles.buttonPicker}
          onClick={() => onChange(color)}
          aria-label={`Select color ${color}`}
          style={{ backgroundColor: color }}
        >
          {value === color && <Check size={16} />}
        </button>
      ))}
    </div>
  );
};

export default ColorPicker;
