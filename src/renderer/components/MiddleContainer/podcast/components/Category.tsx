import '../../../../styles/category/category.css';

type Props = {
  setCategory: (cat: number) => void;
  category: number;
};

export default function Category({ category, setCategory }: Props) {
  return (
    <div className="podcast__category__container">
      <p
        onClick={() => setCategory(2)}
        className={
          category === 2
            ? 'category entertainment current'
            : 'category entertainment'
        }
      >
        음악/예능/오락
      </p>
      <p
        onClick={() => setCategory(3)}
        className={
          category === 3 ? 'category education current' : 'category education'
        }
      >
        시사/교양
      </p>
      <p
        onClick={() => setCategory(1)}
        className={category === 1 ? 'category drama current' : 'category drama'}
      >
        드라마
      </p>
      <p
        onClick={() => setCategory(4)}
        className={
          category === 4 ? 'category others current' : 'category others'
        }
      >
        기타
      </p>
    </div>
  );
}
