import { HeaderContainer } from './styles'
import Logo from '../../assets/Logo.svg'
import { Scroll, Timer } from 'phosphor-react'
import { NavLink } from 'react-router-dom'

export function Header() {
  return (
    <HeaderContainer>
      <img src={Logo} alt="Logo Ignite Timer" />
      <nav>
        <NavLink to="/" title="Timer">
          <Timer width={24} height={24} />
        </NavLink>
        <NavLink to="/history" title="Histórico">
          <Scroll width={24} height={24} />
        </NavLink>
      </nav>
    </HeaderContainer>
  )
}
