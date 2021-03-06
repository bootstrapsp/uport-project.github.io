import React from 'react'
import Helmet from 'react-helmet'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { uPortConnect } from '../../utilities/uPortConnectSetup'
import { connect } from 'react-redux'

import SiteHeader from '../../components/Layout/Header'
import config from '../../../data/SiteConfig'
import myAppsBg from '../../images/myapps-bg.svg'
import '../../layouts/css/myapps.css'

const BodyContainer = styled.div`
  padding: 0;
  overflow: hidden;
  .myapps-start-right {
    height: 100vh;
    background-image: url(${myAppsBg})
  }
`

class MyAppsPage extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      uri: {},
      showImage: false,
      showResult: false
    }
    this.loginRequest = this.loginRequest.bind(this)
  }
  componentDidUpdate () {
    if (this.props.profile) {
      if (this.props.profile.uportApps) {
        this.props.history.push('/myapps/list')
      } else if (this.props.profile.did) {
        this.props.history.push('/myapps/getstarted')
      } else {
        return
      }
    }
  }
  loginRequest (e) {
    e.preventDefault()
    const history = this.props.history
    try {
      uPortConnect.requestDisclosure({requested: ['name'], verified: ['uport-apps'], notifications: true})
      uPortConnect.onResponse('disclosureReq').then(response => {
        this.props.saveProfile({name: response.payload.name, did: response.payload.did, uportApps: response.payload['uport-apps']})
        if (this.props.profile.uportApps) {
          history.push('/myapps/list')
        } else {
          history.push('/myapps/getstarted')
        }
      })
    } catch (e) {
      console.log(e)
    }
  }
  render () {
    return (
      <div className='index-container'>
        <Helmet title={config.siteTitle} />
        <main>
          <MyAppsHeadContainer>
            <SiteHeader
              activeCategory={''}
              location={this.props.location}
              types={this.props.data.navCategories} />
          </MyAppsHeadContainer>
          <BodyContainer>
            <div className={'Grid Grid--gutters'}>
              <div className='Grid-cell myapps-start-left-wrap'>
                <div className='myapps-start-left'>
                  <h1 className='title'>Decentralized Identity for Decentralized Applications</h1>
                  <p>Seamless login. Ethereum transaction signing. User credential issuance and consumption.</p>
                  <div className={`myapps-button`}>
                    <a href='#' onClick={(e) => { this.loginRequest(e) }}>
                      Login with uPort
                    </a>
                  </div>
                </div>
              </div>
              <div className='Grid-cell myapps-start-right' />
            </div>
          </BodyContainer>
        </main>
      </div>
    );
  }
}

const MyAppsHeadContainer = styled.div`
  background: ${props => props.theme.brand}
`

export const pageQuery = graphql`
query MyAppsQuery {
    allMarkdownRemark(
      limit: 2000
      filter: { frontmatter: { type: { eq: "content" }}}
    ) {
      edges {
        node {
          fields {
            slug
          }
          excerpt
          timeToRead
          frontmatter {
            title
          }
        }
      }
    }
    navCategories:
    allMarkdownRemark(
      filter: { frontmatter: { category: { ne: null }, index: { ne: null }}}
    ) {
      edges {
        node {
          fields {
            slug
          }
          headings {
            value
            depth
          }
          frontmatter {
            category
            index
          }
        }
      }
    }
  }
`

MyAppsPage.propTypes = {
  profile: PropTypes.object.isRequired,
  saveProfile: PropTypes.func.isRequired
}

const mapStateToProps = ({ profile }) => {
  return { profile }
}

const mapDispatchToProps = dispatch => {
  return { saveProfile: (profile) => dispatch({ type: `SAVE_PROFILE`, profile: profile }) }
}

export default connect(mapStateToProps, mapDispatchToProps)(MyAppsPage)
