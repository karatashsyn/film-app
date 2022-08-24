import { Link } from 'react-router-dom'

function Categories(props) {
  const categoriesList = document.querySelector('.categories')
  const hideCategories = () => {
    categoriesList.classList.remove('active')
  }
  return (
    <div>
      <div onMouseLeave={hideCategories} className="categories">
        {props.categories.map((c) => (
          <div key={c.id}>{c.name}</div>
        ))}
      </div>
    </div>
  )
}

export default Categories
