import React from 'react'
import Helmet from 'react-helmet'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import ReactModal from 'react-modal';
import {Connect, SimpleSigner} from 'uport-connect'
import { connect } from 'react-redux'

import SEO from '../../components/SEO/SEO'
import SiteHeader from '../../components/Layout/Header'
import config from '../../../data/SiteConfig'
import appMgrBg from '../../images/appmgr-bg.svg'
import uportLogo from '../../images/Horizontal-Logo-purple.svg'
import googlePlayBadge from '../../images/google-play-badge.svg'
import appStoreBadge from '../../images/app-store-badge.svg'
import '../../layouts/css/appmanager.css'

const QRCode = require('qrcode.react')
const BodyContainer = styled.div`
  padding: 0;
  overflow: hidden;
  .appmgr-start-right {
    height: 100vh;
    background-image: url(${appMgrBg})
  }
`

const uPortConnect = new Connect('uPort Demo', {
  clientId: '2osnfJ4Wy7LBAm2nPBXire1WfQn75RrV6Ts',
  signer: SimpleSigner('fa09a3ff0d486be2eb69545c393e2cf47cb53feb44a3550199346bdfa6f53245'),
  network: 'rinkeby'
})

class AppManagerPage extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      uri: {},
      profile: {},
      showImage: false,
      showResult: false,
      showExample: false,
      showProfile: false,
      showModal: false
    }
    this.handleOpenModal = this.handleOpenModal.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);
    this.loginRequest = this.loginRequest.bind(this)
  }
  handleOpenModal (e) {
    e.preventDefault()
    this.loginRequest(e)
    this.setState({ showModal: true })
  }
  handleCloseModal (e) {
    e.preventDefault()
    this.setState({ showModal: false })
  }
  loginRequest (e) {
    const history = this.props.history
    uPortConnect.requestCredentials({
      requested: ['name', 'avatar', 'phone', 'country'] },
      (uri) => {
        this.setState({ uri: uri, showImage: true, showResult: false})
      }).then((userProfile) => {
        this.setState({showImage: false, showResult: true, profile: userProfile})
        this.props.saveProfile(userProfile)
        this.handleCloseModal(e)
        history.push('/appmanager/getstarted')
        console.log(userProfile)
      }
    )
  }
  render () {
    const postEdges = this.props.data.allMarkdownRemark.edges
    return (
      <div className='index-container'>
        <Helmet title={config.siteTitle} />
        <main>
          <AppManagerHeadContainer>
            <SiteHeader
              activeCategory={''}
              location={this.props.location}
              categories={this.props.data.navCategories} />
          </AppManagerHeadContainer>
          <BodyContainer className='appMgrBody'>
            <div className={'Grid Grid--gutters'}>
              <div className='Grid-cell appmgr-start-left-wrap'>
                <div className='appmgr-start-left'>
                  <h1 className='title'>Decentralized Identity for Decentralized Applications</h1>
                  <p>Seamless login. Ethereum transaction signing. User credential issuance and consumption.</p>
                  <div className={`appmgr-button`}>
                    <a href='/appmanager/getstarted' onClick={(e) => { this.handleOpenModal(e) }}>
                      Login with uPort
                    </a>
                  </div>
                </div>
              </div>
              <div className='Grid-cell appmgr-start-right' />
            </div>
            <ReactModal
              isOpen={this.state.showModal}
              className='connectModal'
              contentLabel='uPort Connect'
              parentSelector={() => document.querySelector('.appMgrBody')}
              >
              {(this.state.showImage && this.state.showResult === false) && (
                <div className='modal-content'>
                  <a className='closeConnectModal' href='/' onClick={(e) => { this.handleCloseModal(e) }}>X</a>
                  <div className='modal-header'>
                    <img style={{maxWidth: '120px'}} src={uportLogo} />
                    <h4>AppManager</h4>
                  </div>
                  <p>Scan this QR with the uPort Wallet App to login</p>
                  <div className={`demo-qr-container`}>
                    <a href={this.state.uri}>
                      <QRCode
                        className={`demo-qr`}
                        value={this.state.uri}
                        size={300}
                        bgColor={`#f9f9fa`}
                        fgColor={`#5c50ca`}
                      />
                    </a>
                  </div>
                  <div className='modal-footer'>
                    <p>Don't have uPort Wallet yet? Get it here!</p>
                    <a href='https://play.google.com/store/apps/details?id=com.uportMobile' target='_blank'>
                      <img src={googlePlayBadge} />
                    </a>
                    <a href='https://itunes.apple.com/us/app/uport-id/id1123434510?mt=8' target='_blank'>
                      <img src={appStoreBadge} />
                    </a>
                  </div>
                </div>
              )}
            </ReactModal>
          </BodyContainer>
        </main>
      </div>
    );
  }
}

const AppManagerHeadContainer = styled.div`
  background: ${props => props.theme.brand}
`

export const pageQuery = graphql`
query AppManagerQuery {
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

const IndexHeadContainer = styled.div`
  background: ${props => props.theme.brand};
`

AppManagerPage.propTypes = {
  profile: PropTypes.object.isRequired,
  saveProfile: PropTypes.func.isRequired
}

const mapStateToProps = ({ profile }) => {
  return { profile }
}

const mapDispatchToProps = dispatch => {
  return { saveProfile: (profile) => dispatch({ type: `SAVE_PROFILE`, profile: profile }) }
}

export default connect(mapStateToProps, mapDispatchToProps)(AppManagerPage)