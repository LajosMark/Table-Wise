import Foods from "../components/MenuPagesComponent/Foods"
import Header from "../components/MenuPagesComponent/Header"
import Logo from "../components/Logo"

const Menu = ({foodcategories, mealCategoriesfetch}) => {
  return (
    <>
    <Header/>
    <Logo/>
    <Foods foodcategories={foodcategories} mealCategoriesfetch={mealCategoriesfetch}/>
    </>
  )
}

export default Menu