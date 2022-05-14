import '../../../../styles/category/category.css';

type Props = {
  // eslint-disable-next-line @typescript-eslint/ban-types
  dispatch: Function;
  selectedCategory: number;
};

export default function Category({ selectedCategory, dispatch }: Props) {
  return (
    <div className="podcast__category__container">
      <p
        onClick={() => {
          dispatch({ type: 'PODCAST_SEARCH', search: { category: 2 } });
        }}
        className={
          selectedCategory === 2
            ? 'category entertainment current'
            : 'category entertainment'
        }
      >
        음악/예능/오락
      </p>
      <p
        onClick={() =>
          dispatch({ type: 'PODCAST_SEARCH', search: { category: 3 } })
        }
        className={
          selectedCategory === 3
            ? 'category education current'
            : 'category education'
        }
      >
        시사/교양
      </p>
      <p
        onClick={() =>
          dispatch({ type: 'PODCAST_SEARCH', search: { category: 1 } })
        }
        className={
          selectedCategory === 1 ? 'category drama current' : 'category drama'
        }
      >
        드라마
      </p>
      <p
        onClick={() =>
          dispatch({ type: 'PODCAST_SEARCH', search: { category: 4 } })
        }
        className={
          selectedCategory === 4 ? 'category others current' : 'category others'
        }
      >
        기타
      </p>
    </div>
  );
}
