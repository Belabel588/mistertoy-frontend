export function ToyPreview({ toy, onToggleToy }) {
  return (
    <article className="toy-preview">
      <h2 className={(toy.isNew) ? 'new' : ''} onClick={onToggleToy}>
        Toy: {toy.name}
      </h2>
      <h4>Price: {toy.price}</h4>
      <img src={`../assets/img/${'toy'}.png`} alt="" />
    </article>
  )
}