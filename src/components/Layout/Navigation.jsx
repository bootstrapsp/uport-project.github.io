import React from "react"
import Link from 'gatsby-link'
import styled from 'styled-components'
import UserLinks from '../UserLinks'

const NavContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  background: ${props => props.theme.brand};

  .nav-link {
    font-size: 1.6rem;
    margin-right: 10px;
    font-weight: 200;
    color: black;
  }

  @media screen and (max-width: 600px) {
    display: flex;
    flex-direction: column;
    align-items: center;

    section {
      margin-bottom: 20px;
    }

    span {
      display: none;
    }

  }
`

class Navigation extends React.Component {
    navListItems() {
        const navItems = []
        this.props.sections.forEach(section => {
            navItems.push(
                <Link className='nav-link' to='/' > {section.toUpperCase()} </Link>
            )
        })
        return navItems
    }
    render() {
    return (
        <NavContainer>
            <section>
                {this.navListItems()}
            </section>
            <span><UserLinks /></span>
        </NavContainer>
    )
    }
}

export default Navigation
{/* <Link className='nav-link' to='/' > HOME </Link>
    <Link className='nav-link' to='/lesson-one' > GUIDES </Link>
    <Link className='nav-link' to='/about' > OVERVIEW </Link>
    <Link className='nav-link' to='/post-one' > API DOCS</Link> */}