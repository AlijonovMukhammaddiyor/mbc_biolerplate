/* eslint-disable jsx-a11y/label-has-associated-control */
import '../../../../styles/onoff/onOff.css';

type Props = {
  handleChange: () => void;
  on: boolean;
  id: string;
};

export default function OnOff({ handleChange, on, id }: Props) {
  return (
    <div className="switch__container">
      <input
        checked={on}
        onChange={() => handleChange()}
        className="react-switch-checkbox"
        id={`react-switch-new ${id}`}
        type="checkbox"
      />
      <label
        style={{ background: on ? '#7742cc' : '#cccbcb' }}
        className="react-switch-label"
        htmlFor={`react-switch-new ${id}`}
      >
        <span className="react-switch-button" />
      </label>
    </div>
  );
}
