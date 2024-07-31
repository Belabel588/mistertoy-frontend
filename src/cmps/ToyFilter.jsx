import { useState, useEffect } from 'react';

export function ToyFilter({ filterBy, onSetFilterBy }) {
  // console.log(filterBy);
  const [filterByToEdit, setFilterByToEdit] = useState({ ...filterBy });
  // console.log(filterByToEdit);

  useEffect(() => {
    // Notify parent
    onSetFilterBy(filterByToEdit);
  }, [filterByToEdit, onSetFilterBy]);

  function handleChange({ target }) {
    let field = target.name;
    let value = target.value;

    switch (target.type) {
      case 'number':
        value = +value
        break;
      case 'checkbox':
        value = target.checked;
        break;

      default:
        break;
    }

    setFilterByToEdit((prevFilter) => ({ ...prevFilter, [field]: value }));
  }

  function onLabelChange({ target }) {
    const { value: label } = target;

    setFilterByToEdit((prev) => {
      const updatedLabel = [label, ...prev.label.slice(1)];
      return { ...prev, label: updatedLabel };
    });
  }

  function onSubmitFilter(ev) {
    ev.preventDefault();
    onSetFilterBy(filterByToEdit);
  }

  const { name, price, label } = filterByToEdit;
  console.log(filterByToEdit);
  return (
    <section className="toy-filter">
      <h2>Filter Toys</h2>
      <form onSubmit={onSubmitFilter}>
        <input
          value={name}
          onChange={handleChange}
          type="search"
          placeholder="By Name"
          id="name"
          name="name"
        />
        <label htmlFor="price"> Max Price: </label>
        <input
          value={price}
          onChange={handleChange}
          type="number"
          placeholder="By Price"
          id="price"
          name="price"
        />
        <label htmlFor="label">Label: </label>
        <select id="label" name="label" value={label[0] || ''} onChange={onLabelChange}>
          <option value="">All</option>
          <option value="On wheels">On wheels</option>
          <option value="Box game">Box game</option>
          <option value="Art">Art</option>
          <option value="Baby">Baby</option>
          <option value="Doll">Doll</option>
          <option value="Puzzle">Puzzle</option>
          <option value="Outdoor">Outdoor</option>
          <option value="Battery Powered">Battery Powered</option>
        </select>
        <button type="submit">Apply Filter</button>
      </form>
    </section>
  );
}