import { useState } from 'react';
import iconClose from '../../../../assets/middle/icon_close.svg';
import '../../../../styles/deletePrompt/delete.css';

type Props = {
  deleteSelected: (res: boolean) => void;
  title: string;
};

export default function DeletePrompt({ deleteSelected, title }: Props) {
  return (
    <div className="delete__prompt__container">
      <img
        onClick={() => deleteSelected(false)}
        src={iconClose}
        alt=""
        className="icon__close"
      />
      <div className="confirmation__text">{title}?</div>
      <div className="button__container">
        <button
          type="submit"
          className="cancel_button"
          onClick={() => deleteSelected(false)}
        >
          취소
        </button>
        <button
          type="submit"
          className="confirmation_button"
          onClick={() => deleteSelected(true)}
        >
          삭체
        </button>
      </div>
    </div>
  );
}
