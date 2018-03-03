import React from "react"
import styled from 'styled-components'
import Navigation from './Navigation'

class MainHeader extends React.Component {

    navHeadings() {
        const navHeadings = [];
        this.props.navCategories.forEach(cat => {
            if (!navHeadings.includes(cat)){
                navHeadings.push(cat);
            }
        })
        return navHeadings
    }
    render() {
        return (
            <SiteContainer>
              <Navigation
                sections={this.navHeadings()} />
            </SiteContainer>
        )
  }
}

const SiteContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: ${props => props.theme.brand};
  height: 100%;
  padding:  25px;
`

/* eslint no-undef: "off"*/
export const pageQuery = graphql`
    query HeaderPage {
        navCategories: allMarkdownRemark (
            filter: { frontmatter: { category: { ne: null } } }
        ) {
            edges {
                node {
                    frontmatter {
                        category
                    }
                }
            }
        }
    }
`;

export default MainHeader