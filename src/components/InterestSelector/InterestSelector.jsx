import { useState, useRef, useEffect, useCallback } from 'react';
import Button from '../Button/Button';
import S from './InterestSelector.module.css';
import PropTypes from 'prop-types';

function InterestSelector({ interests, onSelectInterest, onViewAll }) {
  const [isOpen, setIsOpen] = useState(false);
  const modalRef = useRef(null);

  const handleOpenSelector = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleOutsideClick = useCallback((event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      handleClose();
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
      document.body.style.overflow = 'hidden';
    } else {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, handleOutsideClick]);

  const handleInterestClick = (interest) => {
    onSelectInterest(interest);
    handleClose();
  };

  const handleViewAll = () => {
    onViewAll();
    handleClose();
  };

  return (
    <div>
      <Button color="white" onClick={handleOpenSelector}>
        <span className="i_target"></span>관심분야 선택하기
      </Button>
      {isOpen && (
        <div className={`${S.backdrop} ${S.open}`}>
          <div
            className={`${S.container} ${isOpen ? S.show : ''}`}
            ref={modalRef}
          >
            <div className={S.header}>
              <div className={S.headerAllButton}>
                <h2 className="para-md">관심분야 선택</h2>
              </div>
              <button onClick={handleClose} className={S.closeButton}>
                <span className="i_close"></span>
              </button>
            </div>
            <div className={S.interestList}>
              <button onClick={handleViewAll} className={S.viewAllButton}>
                전체
              </button>
              {interests.map((interest) => (
                <button
                  key={interest.id}
                  className={`${S.interestButton} para-md`}
                  onClick={() => handleInterestClick(interest)}
                >
                  {interest.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

InterestSelector.propTypes = {
  interests: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
    })
  ).isRequired,
  onSelectInterest: PropTypes.func.isRequired,
  onViewAll: PropTypes.func.isRequired,
};

export default InterestSelector;
