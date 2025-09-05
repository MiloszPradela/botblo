import React, { useState, useEffect, useRef } from 'react';

interface Site {
  id: number | string;
  name: string;
}

interface CustomSelectProps {
  sites: Site[];
  selectedSiteId: string;
  setSelectedSiteId: (id: string) => void;
}

const CustomSelect: React.FC<CustomSelectProps> = ({ sites, selectedSiteId, setSelectedSiteId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSelectOption = (id: string) => {
    setSelectedSiteId(id); 
    setIsOpen(false);      
  };

  const selectedSiteName = sites.find(site => site.id.toString() === selectedSiteId)?.name || '-- Wybierz z listy --';

  return (
    <div className="custom-select-container" ref={wrapperRef}>
      <div 
        className={`select-selected ${isOpen ? 'select-arrow-active' : ''}`} 
        onClick={() => setIsOpen(!isOpen)}
      >
        {selectedSiteName}
      </div>

      {isOpen && (
        <div className="select-items">
          {sites.map(site => (
            <div 
              key={site.id} 
              className={`select-item ${site.id.toString() === selectedSiteId ? 'same-as-selected' : ''}`}
              onClick={() => handleSelectOption(site.id.toString())}
            >
              {site.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomSelect;
