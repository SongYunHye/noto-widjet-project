import React from 'react';

function Checkbox({ id, checked, onChange, label }) {
  return (
    <div className="item_checkbox">
      <input 
        id={id}
        className="inp_comm" 
        type="checkbox"
        checked={checked}
        onChange={onChange}
      />
      <label 
        className="lab_comm" 
        htmlFor={id}
        data-disabled="false" 
        data-check={checked ? "true" : "false"}
      >
        <span className="ico_check"></span>
        {label && <span className="txt_checkbox">{label}</span>}
      </label>
    </div>
  );
}

export default Checkbox;
