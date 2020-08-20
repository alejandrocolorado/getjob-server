const queryObject = {
  category: null,
  skills: [],
};

const tags = ["php", "HMTL", "google analytics", "product management"];

const categories = ["design", "web"];

function Tag({ tag, ...rest }) {
  return <div {...rest}>{tag}</div>;
}

function Category({ category, ...rest }) {
  return <div {...rest}>{category}</div>;
}

function loginPage() {
  const [state, setState] = useState(queryObject);

  function onClickCategory(category) {
    setState({
      ...state,
      category,
    });
  }

  //llamar al backend

  function buildQuery() {
    return `caterogy=${state.category}&tags=${state.skills.join(",")}`;
  }

  function onClickGo() {
    const url = buildQuery();
  }

  return (
    <div>
      <div>
        {categories.map((el, i) => (
          <Category category={el} key={i} onClick={() => onClickCategory(el)} />
        ))}
      </div>

      <div>
        {tags.map((el, i) => (
          <Tag tag={el} key={i} />
        ))}
      </div>
    </div>
  );
}
