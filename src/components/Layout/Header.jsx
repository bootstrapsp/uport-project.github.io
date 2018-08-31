import React from 'react'
import styled from 'styled-components'
import Link from 'gatsby-link'
import Navigation from './Navigation'
import Search from '../Search'
import bannerImg from '../../images/Horizontal-Logo.svg'

class MainHeader extends React.Component {
  navHeadings () {
    const navHeadings = []
    this.props.types.edges.forEach(type => {
      if (!navHeadings.includes(type.node.frontmatter.type)) {
        navHeadings.push(type.node.frontmatter.type)
      }
    })
    return navHeadings
  }
  render () {
    return (
      <SiteContainer>
        <div className={'Grid Grid--gutters'}>
          <div className='Grid-cell'>
            <span className={`brand w-nav-brand`}>
              <Link to='/'>
                <img src={bannerImg} />
              </Link>
            </span>
          </div>
          <div className='Grid-cell'>
            <Search />
          </div>
          <div className='Grid-cell nav-wrap'>
            <Navigation
              className={`w-nav`}
              sections={this.navHeadings()}
              data={this.props.types.edges}
              activeSection={this.props.activeSection} />
          </div>
        </div>
      </SiteContainer>
    )
  }
}

const SiteContainer = styled.header`
  .Grid--gutters {
    margin: 0;
  }
  .nav-wrap #topNav {
    text-align: right;
    white-space: nowrap;
  }
  .Grid-cell {
    padding: 0;
  }
  img {
    padding-bottom: 20px;
  }
  .bm-overlay {
    display:none;
  }
  @media screen and (max-width: 1068px) {
    .nav-wrap {
      max-width: 5%;
    }
  }
`

export default MainHeader
