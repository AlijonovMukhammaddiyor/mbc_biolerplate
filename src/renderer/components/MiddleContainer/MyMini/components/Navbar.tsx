import { useState } from 'react';
import '../../../../styles/myMiniNavbar/navbar.css';
import iconLeft from '../../../../assets/middle/mymini/icon-more-left.svg';
import iconRight from '../../../../assets/middle/mymini/icon-more-right.svg';

type Props = {
  tab: string;
  setTab: (tab: string) => void;
  tabs: string[];
};

export default function Navbar({ tab, setTab, tabs }: Props) {
  const [index, setIndex] = useState(0);

  return (
    <div className="mymini__navbar__container">
      {index !== 0 && (
        <button type="button" onClick={scrollLeft} className="left">
          <img src={iconLeft} alt="" />
        </button>
      )}
      <div className="nav__items" id="mymini__nav_items">
        <button
          type="button"
          className={
            tab === tabs[0]
              ? 'item recent__episodes current'
              : 'item recent__episodes'
          }
          onClick={() => {
            setTab(tabs[0]);
            scrollLeft();
          }}
        >
          <div>최근 청취한 에피소드</div>
        </button>

        <button
          type="button"
          className={
            tab === tabs[1]
              ? 'item subscribed__programs current'
              : 'item subscribed__programs'
          }
          onClick={() => setTab(tabs[1])}
        >
          <div>팟캐스트 &apos;구독&apos;</div>
        </button>
        <button
          type="button"
          className={
            tab === tabs[2]
              ? 'item liked__episodes current'
              : 'item liked__episodes'
          }
          onClick={() => {
            setTab(tabs[2]);
            scrollLittleRight();
          }}
        >
          <div>에피소드 &apos;좋아요&apos;</div>
        </button>
        <button
          type="button"
          className={
            tab === tabs[3] ? 'item liked__songs current' : 'item liked__songs'
          }
          onClick={() => setTab(tabs[3])}
        >
          <div>선곡 &apos;좋아요&apos;</div>
        </button>

        <div className="item blank" />
      </div>
      {index !== 1 && (
        <button type="button" onClick={scrollRight} className="right">
          <img src={iconRight} alt="" />
        </button>
      )}
    </div>
  );

  function scrollLittleRight() {
    const container = document.getElementById(
      'mymini__nav_items'
    ) as HTMLDivElement;
    container.scroll({ left: 150, behavior: 'smooth' });
    setIndex(1);
  }

  function scrollLeft() {
    const container = document.getElementById(
      'mymini__nav_items'
    ) as HTMLDivElement;
    container.scroll({ left: 0, behavior: 'smooth' });
    setIndex(0);
    setTab(tabs[0]);
  }

  function scrollRight() {
    const container = document.getElementById(
      'mymini__nav_items'
    ) as HTMLDivElement;
    container.scroll({ left: 150, behavior: 'smooth' });
    setIndex(1);
    setTab(tabs[3]);
  }
}
