import { useState } from 'react';
import '../../../../styles/share/share.css';
import iconClose from '../../../../assets/middle/icon_close.svg';

type Props = {
  url: string;
  dispatch: <T extends object>(par: T) => void;
};

export default function Share({ url, dispatch }: Props) {
  const [currentUrl, setUrl] = useState<string>(url);

  return (
    <div className="podcast__share__container">
      <img
        onClick={() => dispatch({ type: 'PODCAST_SHARE_OFF' })}
        src={iconClose}
        className="icon__close"
        alt=""
      />
      <div className="title">
        <p>URL 공유</p>
      </div>
      <div className="url">
        <p>URL 주소</p>
        <input
          type="text"
          value={currentUrl}
          onChange={(e) => {
            setUrl(e.target.value);
          }}
          id="podcast__url_input"
        />
      </div>

      <button type="submit" onClick={copyUrl} className="copy__btn">
        복사
      </button>
    </div>
  );

  function fallbackCopyTextToClipboard(text: string) {
    const input = document.getElementById(
      'podcast__url_input'
    ) as HTMLInputElement;
    input.select();
    try {
      document.execCommand('copy');
    } catch (err) {
      console.error('Fallback: Oops, unable to copy', err);
    }
  }

  function copyTextToClipboard(text: string) {
    if (!navigator.clipboard) {
      fallbackCopyTextToClipboard(text);
      return;
    }
    navigator.clipboard
      .writeText(text)
      .then((err) => {
        return 1;
      })
      .catch((err: Error) => {
        console.log(err);
      });
  }

  function copyUrl() {
    const input = document.getElementById(
      'podcast__url_input'
    ) as HTMLInputElement;
    input.select();
    copyTextToClipboard(input.value);
    dispatch({ type: 'PODCAST_SHARE_OFF' });
  }
}
