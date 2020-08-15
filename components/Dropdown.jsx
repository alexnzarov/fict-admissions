import { useState } from "react";

const Dropdown = ({ defaultText, style, data, onChange }) => {
  const [active, setActive] = useState(null);

  return (
    <div className="dropdown is-hoverable" style={style}>
      <div className="dropdown-trigger">
        <button className="button" aria-haspopup="true" aria-controls="dropdown-menu">
          <span>{active ? (data.find(v => v.key === active)).name : defaultText}</span>
          <span className="icon is-small">
            <i className="fas fa-angle-down" aria-hidden="true"></i>
          </span>
        </button>
      </div>
      <div className="dropdown-menu" id="dropdown-menu" role="menu">
        <div className="dropdown-content">
          {
            data.map(v => 
              <a 
                key={v.key} 
                onClick={() => { 
                  setActive(v.key);
                  onChange(v); 
                }}
                className={`dropdown-item ${v.key === active ? 'is-active' : ''}`}
              >
                  {v.name}
              </a>
            )
          }
        </div>
      </div>
    </div>
  );
};

export default Dropdown;
