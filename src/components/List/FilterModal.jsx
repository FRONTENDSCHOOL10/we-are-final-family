import S from './FilterModal.module.css'; // CSS 모듈
import IconButton from '@/components/IconButton/IconButton';
import Button from '@/components/Button/Button';
import { string, func, object } from 'prop-types';
import { useState } from 'react';

FilterModal.propTypes = {
  title: string.isRequired,
  onClose: func,
  filterOptions: object,
  onApply: func,
};

function FilterModal({ title, onClose, filterOptions, onApply }) {
  const [selectedOptions, setSelectedOptions] = useState([]);

  const handleOptionChange = (event) => {
    const { value } = event.target;
    if (title === '성별' || title === '연령') {
      setSelectedOptions([value]);
      onApply(title, value);
    } else {
      setSelectedOptions((prev) =>
        prev.includes(value)
          ? prev.filter((opt) => opt !== value)
          : [...prev, value]
      );
    }
  };

  const handleInterestClick = () => {
    if (title === '관심분야') {
      onApply(title, selectedOptions); // 옵션들을 전달
    } else {
      onApply(title, selectedOptions[0]); // 성별 또는 연령의 경우 단일 값 전달
    }
    onClose();
  };

  return (
    <div className={S.overlay}>
      {/* <section className={S.filterModal}> */}
      <section
        className={`${S.filterModal} ${
          title === '관심분야' ? S.interestFilter : ''
        }`}
      >
        <header>
          <h3 className="hdg-md">{title}</h3>
          <IconButton
            title="모달창 닫기"
            className="i_close"
            onClick={onClose}
          />
        </header>
        <div role="group" className={S.optionWrap}>
          {title === '관심분야' && (
            <button
              type="button"
              className={`${S.buttonAll} para-md ${
                selectedOptions.length === filterOptions[title].length
                  ? S.active
                  : ''
              }`}
              onClick={() => {
                if (selectedOptions.length === filterOptions[title].length) {
                  // 이미 전체가 선택되어 있다면 모두 해제
                  setSelectedOptions([]);
                } else {
                  // 전체 선택
                  setSelectedOptions(
                    filterOptions[title].map((option) => option.value)
                  );
                }
                onApply(title, selectedOptions);
              }}
            >
              전체
            </button>
          )}

          <ul>
            {filterOptions[title].map((option) => (
              <li key={option.value}>
                <button
                  type="button"
                  className={`${S.button} para-md ${
                    selectedOptions.includes(option.value) ? S.active : ''
                  }`}
                  value={option.value}
                  onClick={handleOptionChange}
                >
                  {option.label}
                  {selectedOptions.includes(option.value) && (
                    <span className={`${S.activeIcon} lbl-sm`}>참여중</span> // 선택된 경우에만 span 추가
                  )}
                </button>
              </li>
            ))}
          </ul>
        </div>
        {/* 확인 버튼 */}
        {title === '관심분야' && (
          <Button color="black" onClick={handleInterestClick}>
            적용하기
          </Button>
        )}
      </section>
    </div>
  );
}

export default FilterModal;
